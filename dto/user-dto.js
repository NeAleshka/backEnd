module.exports=class UserDto{
    name;
    lastName;
    phone;
    email;
    id;
    bonuses;
    cardNumber;
    organizationInfo;

    constructor(model) {
        this.id=model.id
        this.email=model.email
        this.lastName=model.lastName
        this.phone=model.phone
        this.name=model.name
        this.bonuses=model.bonuses
        this.cardNumber=model.cardNumber
        this.organizationInfo=model.organizationInfo
    }
}
