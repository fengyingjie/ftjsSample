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

  message: string;

  constructor(private http: HttpClient) { }

  async ngOnInit() {

    const showNmDiv = document.getElementById('myCanvas');

    const showNmCanvas = document.createElement('canvas');
    const showNmContext = showNmCanvas.getContext( '2d' );

    this.message = 'Loading train images data.'

    // const trainImages = this.http.get(TRAIN_IMAGES_PATH,{responseType: 'arraybuffer'});
    // trainImages.toPromise().then( data => {
    //   this.trainImageData = new Uint8Array(data);
    //   this.message = 'Train images data loaded';
    // });

    // const trainLabel = this.http.get(TRAIN_LABELS_PATH,{responseType: 'arraybuffer'});
    // trainLabel.toPromise().then( data => {
    //   this.trainLabelData = new Uint8Array(data);
    //   this.message = 'Train label data loaded';
    // });

    // const t10kL = this.http.get('/assets/t10k-labels.idx1-ubyte',{responseType: 'arraybuffer'});
    // t10kL.toPromise().then( data => {

    //   this.message = 'Loading complate 1';

    //   const t10kLabel = new Uint8Array(data);
    //   t10kLabel.forEach((value: number, index: number, array: Uint8Array)=>{
    //     this.message= this.message + " " + value;
    //   });
    // });

    // let t10kI = this.http.get('/assets/t10k-images.idx3-ubyte',{responseType: 'arraybuffer'});

    // let index = 0;

    // t10kI.toPromise().then( data => {

    //   this.message="Loading complate 2";

    //   showNmCanvas.height = data.byteLength/280;
    //    this.drawOneWord(showNmContext,data);

    //    showNmDiv.appendChild(showNmCanvas);
    // });

    // const trainData = new miniData(this.http);
    // await trainData.load();
    // trainData.getTrainData();
    // trainData.getTestData(1);
    this.nn_model();
    this.initModel();
    this.train();

  }

  // drawOneWord(context:CanvasRenderingContext2D,input:ArrayBuffer){

  //   const t10kImage = new Uint8Array(input);

  //   t10kImage.forEach((value: number, index: number, array: ArrayBuffer) =>{
  //     if(value !=0 && index > 15){
  //       const y = (index-15) / 28 * 4;
  //       const x = (index-15) % 28 * 4;
  //       context.fillRect(x,y,4,4);
  //     }
  //   });
  // }

  nn_model() {

    this.model = tf.sequential();

    this.model.add(tf.layers.dense({
      units: 32, inputShape: [784]
    }));

    this.model.add(tf.layers.dense({
      units: 256
    }));
    this.model.add(tf.layers.dense(
      {units: 10, kernelInitializer: 'varianceScaling', activation: 'softmax'}));
  }

  initModel() {
    const model = this.nn_model();
    const LEARNING_RATE = 0.15;
    const optimizer = tf.train.sgd(LEARNING_RATE);
    this.model.compile({
      optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
  }

  async train() {
    const BATCH_SIZE = 16;
    const TRAIN_BATCHES = 10;

    // const TEST_BATCH_SIZE = 100;
    // const TEST_ITERATION_FREQUENCY = 5;

    const data = new miniData(this.http);
    this.message = 'load start';
    await data.load();
    this.message = 'load END';
    const batch = data.getTrainData(null);

    this.message = 'load END2';
    // The entire dataset doesn't fit into memory so we call fit repeatedly
    // with batches.
    const history = await this.model.fit(
        batch.xs.reshape([NUM_TRAIN_ELEMENTS, 784]), batch.labels,
        {batchSize: 16, validationSplit: 0.15, epochs: 5,
          callbacks: {
             onBatchEnd: async (batch1, logs) => {
              this.message = logs.acc + ',' + logs.loss;
             }
          }
        }
        );

    this.message = 'load END3';
    // let valAcc;
    // await this.model.fit(batch.xs.reshape([NUM_TRAIN_ELEMENTS, 784]), batch.labels, {
    //   batchSize:32,
    //   validationSplit:0.15,
    //   epochs: 1,
    //   callbacks: {
    //     onBatchEnd: async (batch, logs) => {
    //       //this.message = logs.acc + "," + logs.loss;
    //       // trainBatchCount++;
    //       // ui.logStatus(
    //       //     `Training... (` +
    //       //     `${(trainBatchCount / totalNumBatches * 100).toFixed(1)}%` +
    //       //     ` complete). To stop training, refresh or close page.`);
    //       // ui.plotLoss(trainBatchCount, logs.loss, 'train');
    //       // ui.plotAccuracy(trainBatchCount, logs.acc, 'train');
    //       // if (onIteration && batch % 10 === 0) {
    //       //   onIteration('onBatchEnd', batch, logs);
    //       // }
    //       await tf.nextFrame();
    //     },
    //     onEpochEnd: async (epoch, logs) => {
    //       valAcc = logs.val_acc;
    //       // ui.plotLoss(trainBatchCount, logs.val_loss, 'validation');
    //       // ui.plotAccuracy(trainBatchCount, logs.val_acc, 'validation');
    //       // if (onIteration) {
    //       //   onIteration('onEpochEnd', epoch, logs);
    //       // }
    //       await tf.nextFrame();
    //     }
    //   }
    // });

    batch.xs.dispose();
    batch.labels.dispose();

    const test =  data.getTestData(null);
    const evalOutput = this.model.evaluate(test.xs.reshape([NUM_TEST_ELEMENTS, 784]), test.labels);

    this.message = this.message +
       'Evaluation result:' +
       'Loss = ' + evalOutput[0].dataSync()[0].toFixed(3) +
       'Accuracy = ' + evalOutput[1].dataSync()[0].toFixed(3);
  }
}

class miniData {

  private trainImageData: Uint8Array;
  private trainLabelData: Uint8Array;
  private testImageData: Uint8Array;
  private testLabelData: Uint8Array;

  constructor(private http: HttpClient) {}

  async load() {

    this.trainLabelData = new Uint8Array(NUM_TRAIN_ELEMENTS * NUM_CLASSES);
    this.testLabelData = new Uint8Array(NUM_TEST_ELEMENTS * NUM_CLASSES);
    this.trainLabelData = this.trainLabelData.fill(0, 0, NUM_TRAIN_ELEMENTS);
    this.testLabelData = this.testLabelData.fill(0, NUM_TEST_ELEMENTS);

    const trainImages = this.http.get(TRAIN_IMAGES_PATH, { responseType: 'arraybuffer' });
    await trainImages.toPromise().then( data => {
       this.trainImageData = new Uint8Array(data);
       this.trainImageData =
        this.trainImageData.slice(16, IMAGE_SIZE * NUM_TRAIN_ELEMENTS + 16);
    });

    const trainLabel = this.http.get(TRAIN_LABELS_PATH, {responseType: 'arraybuffer'});
    await trainLabel.toPromise().then( data => {
      const labelData = new Uint8Array(data).slice(8, NUM_TRAIN_ELEMENTS + 8);
      labelData.forEach( (value, index, array ) => {
      this.trainLabelData.set([1], index * NUM_CLASSES + value);
      });

    });

    const testImages = this.http.get(TEST_IMAGES_PATH, { responseType: 'arraybuffer' });
    await testImages.toPromise().then( data => {
        this.testImageData = new Uint8Array(data);
        this.testImageData =
        this.testImageData.slice(16, IMAGE_SIZE * NUM_TEST_ELEMENTS + 16);
    });

    const testLabel = this.http.get(TEST_LABELS_PATH, {responseType: 'arraybuffer'});
    await testLabel.toPromise().then( data => {
      const labelData = new Uint8Array(data).slice(8, NUM_TEST_ELEMENTS + 8);
      labelData.forEach( (value, index, array ) => {
        this.testLabelData.set([1], index * NUM_CLASSES + value);
      });
    });
  }

  /**
   * Get all training data as a data tensor and a labels tensor.
   *
   * @returns
   *   xs: The data tensor, of shape `[numTrainExamples, 28, 28, 1]`.
   *   labels: The one-hot encoded labels tensor, of shape
   *     `[numTrainExamples, 10]`.
   */
  getTrainData(numExamples) {
    let xs = tf.tensor4d(
        this.trainImageData,
        [NUM_TRAIN_ELEMENTS, IMAGE_H, IMAGE_W, 1]);

    let labels = tf.tensor2d(
        this.trainLabelData,
        [NUM_TRAIN_ELEMENTS , NUM_CLASSES]);

    if (numExamples != null) {
      xs = xs.slice([0, 0, 0, 0], [numExamples, IMAGE_H, IMAGE_W, 1]);
      labels = labels.slice([0, 0], [numExamples, NUM_CLASSES]);
    }
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
        [NUM_TEST_ELEMENTS, IMAGE_H, IMAGE_W, 1]);
    let labels = tf.tensor2d(
        this.testLabelData, [NUM_TEST_ELEMENTS, NUM_CLASSES]);

    if (numExamples != null) {
      xs = xs.slice([0, 0, 0, 0], [numExamples, IMAGE_H, IMAGE_W, 1]);
      labels = labels.slice([0, 0], [numExamples, NUM_CLASSES]);
    }
    return {xs, labels};
  }
}
