import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { Products } from './../interface/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsCollection: AngularFirestoreCollection<Products>;
  toast: any;
  router: any;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
    ) {
    this.productsCollection = this.afs.collection<Products>('Products');
  }


  getAll(){
    return this.afs.collection('Products', ref => ref.orderBy('name', 'asc'))
      .snapshotChanges().pipe(
        map(changes => {
          return changes.map(a => {
            const id = a.payload.doc.id;
            const data =  a.payload.doc.data() as Products;
            return { id, ...data };
          });
        })
      );
  }

  getProductPromotion(){
    return this.afs.collection('Products', ref => ref.where('promotion', '==', true))
      .snapshotChanges().pipe(
        map(changes => {
          return changes.map(a => {
            const id = a.payload.doc.id;
            const data =  a.payload.doc.data() as Products;
            return { id, ...data };
          });
        })
      );
  }

  getByIdImg(id: string){
    return this.afs.collection('Products').doc(id).collection('imgs')
      .snapshotChanges().pipe(
        map(changes => {
          return changes.map(i => {
            // tslint:disable-next-line: no-shadowed-variable
            const id = i.payload.doc.id;
            const data =  i.payload.doc.data();
            return { id, ...data };
          });
        })
      );
  }


  getProducts(){

  }

  addProduct(product: Products, file: File){
    // return this.productsCollection.add(product);
    const id = this.afs.createId();

    this.afs.collection('Products').doc(id).set({
      name: product.name,
      description: product.description,
      price: product.price,
      promotion: product.promotion,
    });
    if (file){
      this.uploadImg(id, file);
    }
  }

  getProduct(id: string){
    return this.productsCollection.doc<Products>(id).valueChanges();
  }

  updateProduct(id: string, products: Products, file: File){
    this.productsCollection.doc<Products>(id).update(products);
    if (file){
      this.uploadImg(id, file);
    }
  }

  deleteProduct(id: string, filePath: string){
    this.productsCollection.doc<Products>(id).delete();
    if (filePath){
      this.removeImg(id, filePath, false);

    }
  }

  uploadImg(id: string, file: File){
                       // 'products/'+id+'/'+file.name
      const filePath = `products/${id}/${file.name}`;
      const ref = this.storage.ref(filePath);
      const task = ref.put(file);
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe( ( (url: any) => {
          this.productsCollection.doc<Products>(id).update({ imgUrl: url, filePath });
          // this.productsCollection.doc<Products>(id).collection('imgs').add({img: url, filePath: filePath});
          }));
        })
      ).subscribe();
  }

  removeImg(id: string, filePath: string, atualizarProduto: boolean = true){
    const ref = this.storage.ref(filePath);
    ref.delete();
    if (atualizarProduto){
      this.productsCollection.doc<Products>(id).update({ imgUrl: '', filePath: '' });

    }
  }

  addImgs(id: string, file: File){
    const filePath = `products/${id}/${file.name}`;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe( ( (url: any) => {
        // this.productsCollection.doc<Products>(id).update({ imgUrl: url, filePath: filePath })
        this.productsCollection.doc<Products>(id).collection('imgs').add({imgUrl: url, filePath});
        }));
      })
    ).subscribe();
  }
}
