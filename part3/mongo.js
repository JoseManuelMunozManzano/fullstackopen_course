const mongoose = require('mongoose');

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log(
    `Please provide the password as argument if you want to list all the entries of your phonebook: node mongo.js <pawword>.
Or provide the password, name and phone as arguments to create a new entry: node mongo.js <password> <name> <phone>`
  );
  process.exit(1);
}

const [, , password, name, number] = process.argv;

const url = `mongodb+srv://vant:${password}@neimerccluster.7sldx.mongodb.net/phonebook-app`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', phonebookSchema);

if (process.argv.length === 5) {
  const person = new Person({
    name,
    number,
  });

  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('phonebook:');
  Person.find({}).then((persons) => {
    persons.forEach(({ name, number }) => {
      console.log(name, number);
    });
    mongoose.connection.close();
  });
}
