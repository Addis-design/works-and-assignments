function Person(name, age) {
    this.name = name;
    this.age = age;
  }
  
  var person1 = new Person("John", 30);
  var person2 = new Person("Jane", 25);
  
  console.log(person1.name); // output: John
  console.log(person2.age); // output: 25
  