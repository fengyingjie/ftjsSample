import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

export const IMAGE_H = 28;
export const IMAGE_W = 28;
const IMAGE_SIZE = IMAGE_H * IMAGE_W;
const NUM_CLASSES = 10;
const NUM_DATASET_ELEMENTS = 65000;
const NUM_TRAIN_ELEMENTS = 55000;
const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS;
const MNIST_IMAGES_SPRITE_PATH =
    '../assets/mnist_images.png';
const MNIST_LABELS_PATH =
    '../assets/mnist_labels_uint8';


@Component({
  selector: 'app-sample2',
  templateUrl: './sample2.component.html',
  styleUrls: ['./sample2.component.less']
})



// class miniData{
//   constructor() {}

//   nextTrainBatch(){

//   }

//   async load() {
//     // Make a request for the MNIST sprited image.
//     const img = new Image();
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     const imgRequest = new Promise((resolve, reject) => {
//       img.crossOrigin = '';
//       img.onload = () => {
//         img.width = img.naturalWidth;
//         img.height = img.naturalHeight;

//         const datasetBytesBuffer =
//             new ArrayBuffer(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4);

//         const chunkSize = 5000;
//         canvas.width = img.width;
//         canvas.height = chunkSize;

//         for (let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i++) {
//           const datasetBytesView = new Float32Array(
//               datasetBytesBuffer, i * IMAGE_SIZE * chunkSize * 4,
//               IMAGE_SIZE * chunkSize);
//           ctx.drawImage(
//               img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width,
//               chunkSize);

//           const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

//           for (let j = 0; j < imageData.data.length / 4; j++) {
//             // All channels hold an equal value since the image is grayscale, so
//             // just read the red channel.
//             datasetBytesView[j] = imageData.data[j * 4] / 255;
//           }
//         }
//         this.datasetImages = new Float32Array(datasetBytesBuffer);

//         resolve();
//       };
//       img.src = MNIST_IMAGES_SPRITE_PATH;
//     });

//     const labelsRequest = fetch(MNIST_LABELS_PATH);
//     const [imgResponse, labelsResponse] =
//         await Promise.all([imgRequest, labelsRequest]);

//     this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer());

//     // Slice the the images and labels into train and test sets.
//     this.trainImages =
//         this.datasetImages.slice(0, IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
//     this.testImages = this.datasetImages.slice(IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
//     this.trainLabels =
//         this.datasetLabels.slice(0, NUM_CLASSES * NUM_TRAIN_ELEMENTS);
//     this.testLabels =
//         this.datasetLabels.slice(NUM_CLASSES * NUM_TRAIN_ELEMENTS);
//   }

//   /**
//    * Get all training data as a data tensor and a labels tensor.
//    *
//    * @returns
//    *   xs: The data tensor, of shape `[numTrainExamples, 28, 28, 1]`.
//    *   labels: The one-hot encoded labels tensor, of shape
//    *     `[numTrainExamples, 10]`.
//    */
//   getTrainData() {
//     const xs = tf.tensor4d(
//         this.trainImages,
//         [this.trainImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
//     const labels = tf.tensor2d(
//         this.trainLabels, [this.trainLabels.length / NUM_CLASSES, NUM_CLASSES]);
//     return {xs, labels};
//   }

//   /**
//    * Get all test data as a data tensor a a labels tensor.
//    *
//    * @param {number} numExamples Optional number of examples to get. If not
//    *     provided,
//    *   all test examples will be returned.
//    * @returns
//    *   xs: The data tensor, of shape `[numTestExamples, 28, 28, 1]`.
//    *   labels: The one-hot encoded labels tensor, of shape
//    *     `[numTestExamples, 10]`.
//    */
//   getTestData(numExamples) {
//     let xs = tf.tensor4d(
//         this.testImages,
//         [this.testImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
//     let labels = tf.tensor2d(
//         this.testLabels, [this.testLabels.length / NUM_CLASSES, NUM_CLASSES]);

//     if (numExamples != null) {
//       xs = xs.slice([0, 0, 0, 0], [numExamples, IMAGE_H, IMAGE_W, 1]);
//       labels = labels.slice([0, 0], [numExamples, NUM_CLASSES]);
//     }
//     return {xs, labels};
//   }
// }
export class Sample2Component implements OnInit {

  private model: tf.Sequential;

  constructor(private http: HttpClient) { }

  ngOnInit() {

    const showNmDiv = document.getElementById('myCanvas');

    const showNmCanvas = document.createElement('canvas');
    const showNmContext = showNmCanvas.getContext( '2d' );
    //showNmContext.drawImage(image, 0, 0, image.width, image.height);
    //showNmContext.fillRect(0,0,100,100);


    
    let indata = new ArrayBuffer(28*28);
    for(let i=0;i<28;i++){
      for(let j=0;j<28;j++){
        if(i==j){
          indata[i*28+j] = 1;
        }else{
          indata[i*28+j] = 0;
        }
      }
    }
    
    

    //showNmCanvas.getContext('2d');

    //let t10kL = this.http.get<ArrayBuffer>('/assets/t10k-labels.idx1-ubyte');
    let t10kL = this.http.get('/assets/t10k-images.idx3-ubyte',{responseType: 'arraybuffer'});
    
    let index = 0;
    // t10kL.forEach((value) =>{
    //    //console.log(value);
    //    indata[index]=value[index++];
    //  });
    //console.log();
    t10kL.toPromise().then( data => {
       //console.log(data);
       this.drawOneWord(showNmContext,data);

       showNmDiv.appendChild(showNmCanvas);
    });

    

  }

  drawOneWord(context:CanvasRenderingContext2D,input:ArrayBuffer){
    for(let i = 0; i < input.byteLength;i++){
            if(input[i] !=0 ){
        const y = i / 28 * 1;
        const x = i % 28 * 1;
        context.fillRect(x,y,1,1);
      }
    }
    // input.forEach((value: number, index: number, array: ArrayBuffer) =>{
    //   if(value !=0 ){
    //     const y = index / 28 * 1;
    //     const x = index % 28 * 1;
    //     context.fillRect(x,y,1,1);
    //   }
    // });
  }

  // nn_model() {
  //   this.model = tf.sequential();
  //   this.model.add(tf.layers.dense({
  //     units: 32, inputShape: [784]
  //   }));
  //   this.model.add(tf.layers.dense({
  //     units: 256
  //   }));
  //   this.model.add(tf.layers.dense(
  //     {units: 10, kernelInitializer: 'varianceScaling', activation: 'softmax'}));
  // }

  // initModel(){
  //   const model = this.nn_model();
  //   const LEARNING_RATE = 0.15;
  //   const optimizer = tf.train.sgd(LEARNING_RATE);
  //   this.model.compile({
  //     optimizer: optimizer,
  //     loss: 'categoricalCrossentropy',
  //     metrics: ['accuracy'],
  //   });
  // }

  // async train() {
  //   const BATCH_SIZE = 16;
  //   const TRAIN_BATCHES = 100;
  
  //   const TEST_BATCH_SIZE = 100;
  //   const TEST_ITERATION_FREQUENCY = 5;
  
  //   for (let i = 0; i < TRAIN_BATCHES; i++) {
  //     const batch = data.nextTrainBatch(BATCH_SIZE);
  
  //     let testBatch;
  //     let validationData;
  //     // Every few batches test the accuracy of the mode.
  //     if (i % TEST_ITERATION_FREQUENCY === 0 && i > 0 ) {
  //       testBatch = data.nextTestBatch(TEST_BATCH_SIZE);
  //       validationData = [
  //         testBatch.xs.reshape([TEST_BATCH_SIZE, 784]), testBatch.labels
  //       ];
  //     }
  
  //     // The entire dataset doesn't fit into memory so we call fit repeatedly
  //     // with batches.
  //     const history = await this.model.fit(
  //         batch.xs.reshape([BATCH_SIZE, 784]), batch.labels,
  //         {batchSize: BATCH_SIZE, validationData, epochs: 1});
  
  //     batch.xs.dispose();
  //     batch.labels.dispose();
  //     if (testBatch != null) {
  //       testBatch.xs.dispose();
  //       testBatch.labels.dispose();
  //     }
  //     await tf.nextFrame();
  //   }
  // }
}
