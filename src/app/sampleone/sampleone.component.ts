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
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));

    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    // Generate some synthetic data for training. (y = 2x - 1)
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8], [10, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7, 9, 11, 13, 15], [10, 1]);

    this.lossValues = new Array<tfvis.Point2D>();

    const history = await model.fit(xs, ys, {
      epochs: 100,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          this.plotLoss(epoch, logs.loss);
        }
      }
    });

    // Use the model to do inference on a data point the model hasn't seen.
    // Should print approximately 39.
    this.result = model.predict(tf.tensor2d([40], [1, 1])).toString();

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
