class NeuralNetwork {
    constructor({ inputCount, outputCount, hiddenLayerCount, hiddenLayerNeuronCount }) {
        this.inputCount = inputCount;
        this.outputCount = outputCount;
        this.hiddenLayerCount = hiddenLayerCount;
        this.hiddenLayerNeuronCount = hiddenLayerNeuronCount;

        this.layers = [];

        // input layer
        this.layers.push(new Layer({ inputCount, outputCount: hiddenLayerNeuronCount }));

        // hidden layers
        for (let i = 0; i < hiddenLayerCount - 1; i++) {
            this.layers.push(new Layer({ inputCount: hiddenLayerNeuronCount, outputCount: hiddenLayerNeuronCount }));
        }

        // output layer
        this.layers.push(new Layer({ inputCount: hiddenLayerNeuronCount, outputCount }));
    }

    static feedForward({ network, inputs }) {
        let outputs = inputs;

        for (const layer of network.layers) {
            outputs = Layer.feedForward({ layer, inputs: outputs });
        }

        return outputs;
    }

    static mutate(inputNetwork, mutationRate = 1) {
        const network = _.cloneDeep(inputNetwork);
        for (let layerIndex = 0; layerIndex < network.layers.length; layerIndex++) {
            for (let i = 0; i < network.layers[layerIndex].weights.length; i++) {
                for (let j = 0; j < network.layers[layerIndex].weights[i].length; j++) {
                    if (Math.random() < mutationRate) {
                        network.layers[layerIndex].weights[i][j] += Math.random() * 2 - 1;
                    }
                }
            }

            for (let i = 0; i < network.layers[layerIndex].biases.length; i++) {
                if (Math.random() < mutationRate) {
                    network.layers[layerIndex].biases[i] += Math.random() * 2 - 1;
                }
            }
        }
        return network;
    }
}

class Layer {
    constructor({ inputCount, outputCount }) {
        this.inputs = new Array(inputCount).fill(0);
        this.outputs = new Array(outputCount).fill(0);
        this.biases = new Array(outputCount).fill(0);

        this.weights = [];

        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = (new Array(inputCount).fill(0));
        }

        Layer._randomize(this);
    }

    static _randomize(layer) {
        for (let i = 0; i < layer.weights.length; i++) {
            for (let j = 0; j < layer.weights[i].length; j++) {
                layer.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < layer.biases.length; i++) {
            layer.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward({ layer, inputs }) {
        layer.inputs = inputs;

        for (let i = 0; i < layer.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < layer.inputs.length; j++) {
                sum += layer.inputs[j] * layer.weights[j][i];
            }

            if (sum > layer.biases[i]) {
                layer.outputs[i] = 1;
            } else {
                layer.outputs[i] = 0;
            }
        }

        return layer.outputs;
    }
}