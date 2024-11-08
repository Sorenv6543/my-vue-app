import yuml_diagram from "./yuml_diagram.js";

var yumlText = `
// {type:class}
[User]->[Router]
[Router]->[Home]
[Home]->[FirebaseAuth]
[Home]->[UserDashboard]
[Home]->[AddHouseForm]
[Home]->[HouseList]
[Home]->[FullCalendar]
[AddHouseForm]->[HouseModal]
[HouseModal]->[AddHouseForm]
[FullCalendar]->[FirebaseStore]
[HouseList]->[Home]
[Home]->[FirebaseStore]
`;

var yuml = new yuml_diagram();
var svg = yuml.processYumlDocument(yumlText, false);