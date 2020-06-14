import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

@Component({
  selector: 'app-sampleone',
  templateUrl: './sampleone.component.html',
  styleUrls: ['./sampleone.component.less']
})
export class SampleoneComponent implements OnInit {

  protected result: string;
  lossValues: tfvis.Point2D[];

  constructor() { }

  ngOnInit() {
    this.run();
  }

  async run() {
    // Create a simple model.
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 500000, inputShape: [1]}));
    model.add(tf.layers.activation({activation: 'sigmoid'}));
    model.add(tf.layers.dense({units: 1}));
    
    //model.add(tf.layers.dense({units: 1, inputShape: [10]}));

    // Prepare the model for training: Specify the loss and the optimizer.
    //model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
    model.compile({loss: tf.losses.absoluteDifference, optimizer: 'sgd'});
    //

    // // Generate some synthetic data for training. (y = 2x - 1)
    // const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8,    10,11,12,13,14,15,16,17,18,19], [20, 1]);
    // const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7, 9, 11, 13, 15,19,21,23,25,27,29,31,33,35,37], [20, 1]);

    // Generate some synthetic data for training. (y = x*x - 1)
    const xs = tf.tensor2d([1, 2, 3, 4,  5,   6,   7,  8, 9,  10, 20,  30, 40,   50,   60,   70,   80,   90,   100,  200], [20, 1]);
    const ys = tf.tensor2d([0, 3, 8, 15, 24, 35, 48, 63, 80, 99, 399, 899,1599, 2499, 3599, 4899, 6399, 8099, 9999, 39999], [20, 1]);

    this.lossValues = new Array<tfvis.Point2D>();

    const history = await model.fit(xs, ys, {
      epochs: 1000,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          this.plotLoss(epoch, logs.loss);
        }
      }
    });

    // Use the model to do inference on a data point the model hasn't seen.
    // Should print approximately 39.
    this.result = model.predict(tf.tensor2d([8], [1, 1])).toString();

    const loss = history.history.loss;
    const accuracy = history.history.acc;
}

 plotLoss(epoch, loss) {

  this.lossValues.push({x: epoch, y: loss} as tfvis.Point2D);

  const lossContainer = document.getElementById('loss-canvas');
  tfvis.render.linechart(
      lossContainer,
      {values : this.lossValues},
      {
        xLabel: 'epoch',
        yLabel: 'Loss',
        width: 400,
        height: 300
      });
  }
}
