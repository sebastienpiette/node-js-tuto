// const data = {
//     employees: require('../model/employees.json'),
//     setEmployees: function (data) { this.employees = data }
// }

const Employee = require('../model/Employee');

//new with mongoDB 
const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if(!employees) return res.status(204).json({'message' : 'no Employees found'});
    // console.log("Employees :"+employees)
    res.json(employees);
}

//new wit mongoDB
const createNewEmployee = async (req, res) => {

    if(!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({'message' : 'First and last name required'});
    }

    try {

        //define the result 
        const result = await Employee.create({
            firstname:req.body.firstname,
            lastname:req.body.lastname
        })

    }catch (err) { consol.error(err)};



    // const newEmployee = {
    //     id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname
    // }

    // if (!newEmployee.firstname || !newEmployee.lastname) {
    //     return res.status(400).json({ 'message': 'First and last names are required.' });
    // }

    // data.setEmployees([...data.employees, newEmployee]);
    // res.status(201).json(data.employees);
}

const updateEmployee = async (req, res) => {
    // const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

    if (!req?.body?.id) {
        return res.status(400).json({'message' : 'an ID paramter is required'});
   }

   const employee = await Employee.findOne({_id : req.params.id}).exec();  //MondoDB create automatically a _id parameter in the DB 

    if (!employee) {
        return res.status(204).json({ "message": `No Emnployee matches a ID ${req.body.id}` });
    }

    if (req.body?.firstname) employee.firstname = req.body.firstname;   // ? ==>  optionnaly chaining 
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    // const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    // const unsortedArray = [...filteredArray, employee];
    // data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));

    const result = await employee.save(); //save the employee in the docum,ent 

    res.json(data.employees);
}


const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({'message' : 'Employee ID requiired'});

    //const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    const employee = await Employee.findOne({_id : req.params.id}).exec(); 

    // if (!employee) {
    //     return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    // }
    if (!employee) {
        return res.status(204).json({ "message": `No Emnployee matches a ID ${req.params.id}` });
    }

    // const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    // data.setEmployees([...filteredArray]);

    const result = await employee.deleteOne({_id:req.params.id});

    res.json(data.employees);
}

const getEmployee = async (req, res) => {
    if(!req?.params?.id) return res.status(400).json({'message' : 'Employee ID requiired'}); 

    //const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    const employee = await Employee.findOne({_id : req.params.id}).exec(); 

    // if (!employee) {
    //     return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
    // }
    if (!employee) {
        return res.status(204).json({ "message": `No Emnployee matches a ID ${req.params.id}` });
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}