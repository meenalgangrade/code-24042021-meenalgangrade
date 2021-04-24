const fs = require('fs');
const JSONStream = require('JSONStream');
const csvWriter = require('csv-write-stream');

function getReadStream(inputFilePath) {
    const jsonData = inputFilePath;
    const stream = fs.createReadStream(jsonData, { encoding: 'utf-8' });
    const parser = JSONStream.parse('*');
    return stream.pipe(parser);
}

function getWriteStream(outputFileName) {
    const writer = csvWriter();
    writer.pipe(fs.createWriteStream(outputFileName + '.csv'));
    return writer;
}

function dataProcessor(stream, outputFileName) {
    return new Promise((resolve, reject) => {
        const writer = getWriteStream(outputFileName);
        stream.on('data', data => {
            const bmiObject = bmiDataGenerator(data);
            writer.write(bmiObject);
        });

        stream.on('end', () => {
            resolve();
            writer.end();
        })
    })
}

function bmiDataGenerator(data) {
    const height = data["HeightCm"] / 100;
    const weight = data["WeightKg"];
    let bmi = weight / (height * height);
    bmi = bmi.toFixed(1);
    let category = '';
    let risk = '';

    if (bmi <= 18.4) {
        category = 'Underweight';
        risk = 'Malnutrition risk';
    } else if (bmi <= 24.9) {
        category = 'Normal weight';
        risk = 'Low risk';
    } else if (bmi <= 29.9) {
        category = 'Overweight';
        risk = 'Enhanced risk';
    } else if (bmi <= 34.9) {
        category = 'Moderately obese';
        risk = 'Medium risk';
    } else if (bmi <= 39.9) {
        category = 'Severely obese';
        risk = 'High risk';
    } else {
        category = 'Very severely obese';
        risk = 'Very high risk';
    }

    return { bmi, category, risk };
}

async function main(inputFilePath, outputFileName) {
    if (!inputFilePath || !outputFileName) {
        console.log("Please provide required command line arguments: Input file path, Output file name");
        return "Error";
    }
    await dataProcessor(getReadStream(inputFilePath), outputFileName);
    console.log("Report Generated Successfully");
    return "Success";
}

main(process.argv[2], process.argv[3]);

module.exports = {
    main
}