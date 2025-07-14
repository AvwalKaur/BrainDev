const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB Connected...");

    // Seed initial data
    await seedInitialData();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedInitialData = async () => {
  const CrisisScenario = require("../models/CrisisScenario");
  const count = await CrisisScenario.countDocuments();

  if (count === 0) {
    const scenarios = [
      {
        name: "Major Storm in Northeast Region",
        type: "storm",
        description:
          "Simulates a severe weather event affecting logistics and inventory in the Northeast",
        impacts: {
          low: { delivery: 5, inventory: 3, financial: 5000, response: 30 },
          medium: {
            delivery: 12,
            inventory: 8,
            financial: 15000,
            response: 45,
          },
          high: { delivery: 25, inventory: 15, financial: 35000, response: 75 },
          extreme: {
            delivery: 50,
            inventory: 30,
            financial: 75000,
            response: 120,
          },
        },
      },
      {
        name: "Commodity Price Surge",
        type: "price-surge",
        description:
          "Simulates a sudden increase in commodity prices affecting supply chain costs",
        impacts: {
          low: { delivery: 2, inventory: 5, financial: 8000, response: 25 },
          medium: {
            delivery: 3,
            inventory: 12,
            financial: 25000,
            response: 40,
          },
          high: { delivery: 5, inventory: 25, financial: 60000, response: 65 },
          extreme: {
            delivery: 10,
            inventory: 45,
            financial: 120000,
            response: 90,
          },
        },
      },
    ];

    await CrisisScenario.insertMany(scenarios);
    console.log("Initial crisis scenarios seeded");
  }
};

module.exports = connectDB;
