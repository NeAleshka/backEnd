module.exports=class UserDto{
    name;
    lastName;
    phone;
    email;
    id;
    constructor(model) {
        this.id=model._id
        this.email=model.email
        this.lastName=model.lastName
        this.phone=model.phone
        this.name=model.name
    }
}
