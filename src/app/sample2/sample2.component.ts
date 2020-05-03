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
const TRAIN_IMAGES_PATH =
    '/assets/train-images.idx3-ubyte';
const TRAIN_LABELS_PATH =
    '/assets/train-labels.idx1-ubyte';
const TEST_IMAGES_PATH =
    '/assets/t10k-images.idx3-ubyte';
const TEST_LABELS_PATH =
    '/assets/t10k-labels.idx1-ubyte';

@Component({
  selector: 'app-sample2',
  templateUrl: './sample2.component.html',
  styleUrls: ['./sample2.component.less']
})

export class Sample2Component implements OnInit {

  private model: tf.Sequential;
  private trainLabelData: Uint8Array;
  private trainImageData: Uint8Array;

  message:string;

  constructor(private http: HttpClient) { }

  async ngOnInit() {

    const showNmDiv = document.getElementById('myCanvas');

    const showNmCanvas = document.createElement('canvas');
    const showNmContext = showNmCanvas.getContext( '2d' );

    this.message = 'Loading train images data.';

    const trainImages = this.http.get(TRAIN_IMAGES_PATH,{responseType: 'arraybuffer'});
    trainImages.toPromise().then( data => {
      this.trainImageData = new Uint8Array(data);
      this.message = 'Train images data loaded';
    });

    const trainLabel = this.http.get(TRAIN_LABELS_PATH,{responseType: 'arraybuffer'});
    trainLabel.toPromise().then( data => {
      this.trainLabelData = new Uint8Array(data);
      this.message = 'Train label data loaded';
    });

    const t10kL = this.http.get('/assets/t10k-labels.idx1-ubyte',{responseType: 'arraybuffer'});
    t10kL.toPromise().then( data => {

      this.message = 'Loading complate 1';

      const t10kLabel = new Uint8Array(data);
      t10kLabel.forEach((value: number, index: number, array: Uint8Array)=>{
        this.message= this.message + " " + value;
      });
    });

    let t10kI = this.http.get('/assets/t10k-images.idx3-ubyte',{responseType: 'arraybuffer'});
    
    let index = 0;

    t10kI.toPromise().then( data => {

      this.message="Loading complate 2";

      showNmCanvas.height = data.byteLength/280;
       this.drawOneWord(showNmContext,data);

       showNmDiv.appendChild(showNmCanvas);
    });

    const trainData = new miniData(this.http);
    await trainData.load();
    trainData.getTrainData();
    trainData.getTestData(1);
  }

  drawOneWord(context:CanvasRenderingContext2D,input:ArrayBuffer){

    const t10kImage = new Uint8Array(input);

    t10kImage.forEach((value: number, index: number, array: ArrayBuffer) =>{
      if(value !=0 && index > 15){
        const y = (index-15) / 28 * 4;
        const x = (index-15) % 28 * 4;
        context.fillRect(x,y,4,4);
      }
    });
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

class miniData{

  private trainImageData: Uint8Array;
  private trainLabelData: Uint8Array;
  private testImageData: Uint8Array;
  private testLabelData: Uint8Array;

  constructor(private http: HttpClient) {}

  nextTrainBatch(){

  }

  async load() {
    const trainImages = this.http.get(TRAIN_IMAGES_PATH, { responseType: 'arraybuffer' });
    await trainImages.toPromise().then( data => {
       this.trainImageData = new Uint8Array(data);
        this.trainImageData =
        this.trainImageData.slice(16, IMAGE_SIZE * NUM_TRAIN_ELEMENTS + 16);
    });

    const trainLabel = this.http.get(TRAIN_LABELS_PATH,{responseType: 'arraybuffer'});
    await trainLabel.toPromise().then( data => {
      this.trainLabelData = new Uint8Array(data);
      this.trainLabelData = 
      this.trainLabelData.slice(8, NUM_TRAIN_ELEMENTS + 8);
    });

    const testImages = this.http.get(TEST_IMAGES_PATH, { responseType: 'arraybuffer' });
    await testImages.toPromise().then( data => {
        this.testImageData = new Uint8Array(data);
        this.testImageData =
        this.testImageData.slice(16, IMAGE_SIZE * NUM_TEST_ELEMENTS + 16);
    });

    const testLabel = this.http.get(TEST_LABELS_PATH,{responseType: 'arraybuffer'});
    await testLabel.toPromise().then( data => {
      this.testLabelData = new Uint8Array(data);
      this.testLabelData = 
      this.testLabelData.slice(8, NUM_TEST_ELEMENTS + 8);
    });

    // Slice the the images and labels into train and test sets.
    //this.trainImageData =
    //    this.trainImageData.slice(15, IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
   // this.trainLabelData = 
     //   this.trainLabelData.slice(7, NUM_TRAIN_ELEMENTS);


    // const img = new Image();
    // const canvas = document.createElement('canvas');
    // const ctx = canvas.getContext('2d');
    // const imgRequest = new Promise((resolve, reject) => {
    //   img.crossOrigin = '';
    //   img.onload = () => {
    //     img.width = img.naturalWidth;
    //     img.height = img.naturalHeight;

    //     const datasetBytesBuffer =
    //         new ArrayBuffer(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4);

    //     const chunkSize = 5000;
    //     canvas.width = img.width;
    //     canvas.height = chunkSize;

    //     for (let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i++) {
    //       const datasetBytesView = new Float32Array(
    //           datasetBytesBuffer, i * IMAGE_SIZE * chunkSize * 4,
    //           IMAGE_SIZE * chunkSize);
    //       ctx.drawImage(
    //           img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width,
    //           chunkSize);

    //        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    //       for (let j = 0; j < imageData.data.length / 4; j++) {
    //         // All channels hold an equal value since the image is grayscale, so
    //         // just read the red channel.
    //         datasetBytesView[j] = imageData.data[j * 4] / 255;
    //       }
    //     }
    //     this.datasetImages = new Float32Array(datasetBytesBuffer);

    //     resolve();
    //   };
    //   img.src = MNIST_IMAGES_SPRITE_PATH;
    // });

    // const labelsRequest = fetch(MNIST_LABELS_PATH);
    // const [imgResponse, labelsResponse] =
    //     await Promise.all([imgRequest, labelsRequest]);

    // // Slice the the images and labels into train and test sets.
    // this.trainImages =
    //     this.datasetImages.slice(0, IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
    // this.testImages = this.datasetImages.slice(IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
    // this.trainLabels =
    //     this.datasetLabels.slice(0, NUM_CLASSES * NUM_TRAIN_ELEMENTS);
    // this.testLabels =
    //     this.datasetLabels.slice(NUM_CLASSES * NUM_TRAIN_ELEMENTS);
  }
  /**
   * Get all training data as a data tensor and a labels tensor.
   *
   * @returns
   *   xs: The data tensor, of shape `[numTrainExamples, 28, 28, 1]`.
   *   labels: The one-hot encoded labels tensor, of shape
   *     `[numTrainExamples, 10]`.
   */
  getTrainData() {
    const xs = tf.tensor4d(
        this.trainImageData,
        [this.trainImageData.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
    const labels = tf.tensor2d(
        this.trainLabelData,
        [this.trainLabelData.length , 1]);//NUM_CLASSES]);
    return {xs, labels};
  }

  /**
   * Get all test data as a data tensor a a labels tensor.
   *
   * @param {number} numExamples Optional number of examples to get. If not
   *     provided,
   *   all test examples will be returned.
   * @returns
   *   xs: The data tensor, of shape `[numTestExamples, 28, 28, 1]`.
   *   labels: The one-hot encoded labels tensor, of shape
   *     `[numTestExamples, 10]`.
   */
  getTestData(numExamples) {
    let xs = tf.tensor4d(
        this.testImageData,
        [this.testImageData.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
    let labels = tf.tensor2d(
        this.testLabelData, [this.testLabelData.length, 1]); /// NUM_CLASSES, NUM_CLASSES]);

    if (numExamples != null) {
      xs = xs.slice([0, 0, 0, 0], [numExamples, IMAGE_H, IMAGE_W, 1]);
      labels = labels.slice([0, 0], [numExamples, 1]); //NUM_CLASSES]);
    }
    xs.print();
    labels.print();
    return {xs, labels};
  }
}