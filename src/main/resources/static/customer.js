window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {

    //tooltip
    $('[data-toggle="tooltip"]').tooltip();

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    //dteDOBirth.onchange = dteDOBirthCH;
    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=CUSTOMER", "GET");

    employees = httpRequest("../employee/list", "GET");
    customerstatus = httpRequest("customerstatus/list", "GET");
    customers = httpRequest("../customer/list" , "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2"; //d6d6c2
    updated = "2px solid #ff9900";
    active = "#ff9900";

    loadView();
    loadForm();
}

function loadView() {

    //Search Area
    txtSearchName.value = "";
    txtSearchName.style.background = "";

    //Table Area
    activerowno = "";
    activepage = 1;
    var query = "&searchtext=";
    loadTable(1, cmbPageSize.value, query);
}

//loading the table in customer page
function loadTable(page, size, query) {
    page = page - 1;
    customers = new Array();
    var data = httpRequest("/customer/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) customers = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblCustomer', customers, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblCustomer);

    if (activerowno != "") selectRow(tblCustomer, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldcustomer == null) {
        paginate = true;
    } else {
        if (getErrors() == '' && getUpdates() == '') {
            paginate = true;
        } else {
            paginate = window.confirm("Form has Some Errors or Update Values. " +
                "Are you sure to discard that changes ?");
        }
    }
    if (paginate) {
        activepage = page;
        activerowno = ""
        loadForm();
        loadSearchedTable();
    }

}

//Printtable data
function viewitem(custom, rowno) {

    customer = JSON.parse(JSON.stringify(custom));

    tdregNo.innerHTML = customer.regno;
    tdfName.innerHTML = customer.fname;
    tdlName.innerHTML = customer.lname;
    tdtxtNIC.innerHTML = customer.nic;
    tdtxtEmail.innerHTML = customer.email;
    tdtxtMobile.innerHTML = customer.mobileno;
    tdtxtAddress.innerHTML = customer.address;

    tdtxtDescription.innerHTML = customer.description;
    tdtxtPoints.innerHTML = customer.points;
    tdtxtLand.innerHTML = customer.landno;

    tdcmbStatus.innerHTML = customer.customerstatus_id1.name;
    tdtxtEmployee.innerHTML = customer.employee_id.callingname;
    tddteDate.innerHTML = customer.addeddate;

    $('#dataViewModel').modal('show')


    /*if (employee.photo == null)
        tdphoto.src = 'resourse/image/noimage.png';
    else
        tdphoto.src = atob(employee.photo);*/
}

function btnPrintRowMC() {
    var format = printformtable.outerHTML;
    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'>" +
        "<body><div style='margin-top: 150px'><h1>Customer Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

//auto load require values to the form

function loadForm() {
    customer = new Object();
    oldcustomer = null;

    fillCombo(cmbStatus, "", customerstatus, "name", "Active");
    fillCombo(txtEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    customer.customerstatus_id1 = JSON.parse(cmbStatus.value);
    cmbStatus.disabled = true;

    customer.employee_id = JSON.parse(txtEmployee.value);
    txtEmployee.disabled = true;

    var today = new Date();
    var month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = today.getDate();
    if (date < 10) date = "0" + date;

    dteDate.value = today.getFullYear() + "-" + month + "-" + date;
    customer.addeddate = dteDate.value;
    dteDate.disabled = true;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/customer/nextnumber", "GET");
    regNo.value = nextNumber.regno;
    customer.regno = regNo.value;
    regNo.disabled = "disabled";

    txtPoints.value = parseFloat(0).toFixed(2);
    txtPoints.disabled = true;
    customer.points = txtPoints.value;


    fName.value = "";
    lName.value = "";
    txtNIC.value = "";
    txtEmail.value = "";
    txtMobile.value = "";
    txtLand.value = "";
    txtAddress.value = "";
    txtDescription.value = "";
    // removeFile('flePhoto');

    setStyle(initial);
    dteDate.style.border = valid;
    txtEmployee.style.border = valid;
    cmbStatus.style.border = valid;
    regNo.style.border = valid;
    txtPoints.style.border = valid;

    disableButtons(false, true, true);
}

//set styles to the form

function setStyle(style) {

    regNo.style.border = style;
    fName.style.border = style;
    lName.style.border = style;
    txtNIC.style.border = style;
    txtEmail.style.border = style;
    txtMobile.style.border = style;
    txtLand.style.border = style;
    txtAddress.style.border = style;
    txtDescription.style.border = style;

}

function disableButtons(add, upd, del) {

    if (add || !privilages.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer')
    }

    if (upd || !privilages.update) {
        btnUpdate.setAttribute("disabled", "disabled");
        $('#btnUpdate').css('cursor', 'not-allowed');
    } else {
        btnUpdate.removeAttribute("disabled");
        $('#btnUpdate').css('cursor', 'pointer');
    }

    if (!privilages.update) {
        $(".buttonup").prop('disabled', true);
        $(".buttonup").css('cursor', 'not-allowed');
    } else {
        $(".buttonup").removeAttr("disabled");
        $(".buttonup").css('cursor', 'pointer');
    }

    if (!privilages.delete) {
        $(".buttondel").prop('disabled', true);
        $(".buttondel").css('cursor', 'not-allowed');
    } else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor', 'pointer');
    }

    // select deleted data row
    for (index in customers) {
        if (customers[index].customerstatus_id1.name == "Deleted") {
            tblCustomer.children[1].children[index].style.color = "#f00";
            tblCustomer.children[1].children[index].style.border = "2px solid red";
            tblCustomer.children[1].children[index].lastChild.children[1].disabled = true;
            tblCustomer.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function nicTestFieldBinder(field, pattern, ob, prop, oldob) {
    var regpattern = new RegExp(pattern);

    var val = field.value.trim();
    if (regpattern.test(val)) {
        var dobyear, gendername, noOfDays = "";
        if (val.length === 10) {
            dobyear = "19" + val.substring(0, 2);
            noOfDays = val.substring(2, 5);
        } else {
            dobyear = val.substring(0, 4);
            noOfDays = val.substring(4, 7);
        }
        birthdate = new Date(dobyear + "-" + "01-01");
        if (noOfDays >= 1 && noOfDays <= 366) {
            gendername = "Male";
        } else if (noOfDays >= 501 && noOfDays <= 866) {
            noOfDays = noOfDays - 500;
            gendername = "Female";
        }
        if (gendername === "Female" || gendername === "Male") {
            fillCombo(cmbGender, "Select Gender", genders, "name", gendername);
            birthdate.setDate(birthdate.getDate() + parseInt(noOfDays) - 1)
            dteDOBirth.value = birthdate.getFullYear() + "-" + getmonthdate(birthdate);

            employee.genderId = JSON.parse(cmbGender.value);
            employee.dobirth = dteDOBirth.value;
            employee.nic = field.value;
            if (oldemployee != null && oldemployee.nic != employee.nic) {
                field.style.border = updated;
            } else {
                field.style.border = valid;
            }
            if (oldemployee != null && oldemployee.dobirth != employee.dobirth) {
                dteDOBirth.style.border = updated;
            } else {
                dteDOBirth.style.border = valid;
            }
            if (oldemployee != null && oldemployee.genderId.name != employee.genderId.name) {
                cmbGender.style.border = updated;
            } else {
                cmbGender.style.border = valid;
            }
            dteDOBirthCH();
        } else {
            field.style.border = invalid;
            cmbGender.style.border = initial;
            dteDOBirth.style.border = initial;
            fillCombo(cmbGender, "Select Gender", genders, "name", "");
            dteDOBirth.value = "";
            employee.nic = null;
        }
    } else {
        field.style.border = invalid;
        employee.nic = null;
    }

}

function nicFieldBinder(field, pattern, ob, prop, oldob) {
    var regpattern = new RegExp(pattern);

    var val = field.value.trim();
    if (regpattern.test(val)) {
        employee.nic = val;
        if (oldemployee != null && oldemployee.nic != employee.nic) {
            field.style.border = updated;
            gender = generate(val, field, cmbGender, dteDOBirth);
            fillCombo(cmbGender, "Select Gender", genders, "name", gender);
            cmbGender.style.border = updated;
            dteDOBirth.style.border = updated;
            employee.genderId = JSON.parse(cmbGender.value);
            employee.dobirth = dteDOBirth.value;
        } else {
            field.style.border = valid;
            gender = generate(val, field, cmbGender, dteDOBirth);
            fillCombo(cmbGender, "Select Gender", genders, "name", gender);
            cmbGender.style.border = valid;
            dteDOBirth.style.border = valid;
            employee.genderId = JSON.parse(cmbGender.value);
            employee.dobirth = dteDOBirth.value;
        }
    } else {
        field.style.border = invalid;
        employee.nic = null;
    }
}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (customer.regno == null)
        errors = errors + "\n" + "Customer Registration Null";
    else addvalue = 1;

    if (customer.fname == null)
        errors = errors + "\n" + "Customer First Name Null";
    else addvalue = 1;

    if (customer.lname == null)
        errors = errors + "\n" + "Customer Last Name Null";
    else addvalue = 1;

    if (customer.nic == null)
        errors = errors + "\n" + "Customer NIC Null";
    else addvalue = 1;

    if (customer.email == null)
        errors = errors + "\n" + "Customer Email Null";
    else addvalue = 1;

    if (customer.mobileno == null)
        errors = errors + "\n" + "Customer Mobile No Null";
    else addvalue = 1;

    if (customer.address == null)
        errors = errors + "\n" + "Customer Address Null";
    else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtLand.value == "" || txtDescription.value == "" || txtPoints.value == "") {
            swal({
                title: "Are you sure to continue...?",
                text: "Form has some empty fields.....",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    savedata();
                }
            });

        } else {
            savedata();
        }
    } else {
        swal({
            title: "You have following errors",
            text: "\n" + getErrors(),
            icon: "error",
            button: true,
        });

    }
}

function savedata() {

    swal({
        title: "Are you sure to add following Customer...?",
        text: "\nRegistration No : " + customer.regno +
            "\nFirst Name : " + customer.fname +
            "\nLast Name : " + customer.lname +
            "\nNIC : " + customer.nic +
            "\nEmail: " + customer.email +
            "\nMobile No : " + customer.mobileno +
            "\nLand No : " + customer.landno +
            "\nAddress : " + customer.address +
            "\nPoints : " + customer.points +
            "\nAdded Date : " + customer.addeddate +
            "\nDescription : " + customer.description +
            "\nEmployee  : " + customer.employee_id.callingname,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/customer", "POST", customer);
            if (response == "0") {
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been Done \n Save SuccessFully..!',
                    text: '\n',
                    button: false,
                    timer: 1200
                });
                activepage = 1;
                loadSearchedTable();
                loadForm();
                $('#mainform').modal('hide');
            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true
            });
        }
    });

}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if (oldcustomer == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                loadForm();
            }

        });
    }

}


//when clicking update button in table view
function fillForm(custom, rowno) {
    activepage = rowno;

    if (oldcustomer == null) {
        filldata(custom);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(custom);
            }

        });
    }

}

//fill data to the form
function filldata(custom) {
    clearSelection(tblCustomer);
    selectRow(tblCustomer, activepage, active);

    customer = JSON.parse(JSON.stringify(custom));
    oldcustomer = JSON.parse(JSON.stringify(custom));

    regNo.value = customer.regno;
    regNo.disabled = "disabled";

    dteDate.value = customer.addeddate;
    dteDate.disabled = "disabled" ;

    fName.value = customer.fname;
    lName.value = customer.lname;
    txtNIC.value = customer.nic;
    txtEmail.value = customer.email;
    txtMobile.value = customer.mobileno;
    txtAddress.value = customer.address;

    txtDescription.value = customer.description;
    txtPoints.value = parseFloat(customer.points).toFixed(2);

    txtPoints.disabled = "disabled";
    txtLand.value = customer.landno;

    fillCombo(cmbStatus , "" , customerstatus , "name" , customer.customerstatus_id1.name );
    cmbStatus.disabled = false;

    fillCombo(txtEmployee , "" , employees , "callingname" , customer.employee_id.callingname );
    txtEmployee.disabled = "disabled";

    disableButtons(true, false, false);
    setStyle(valid);
    $('#mainform').modal('show');

    //OPTIONAL FIELDS
    if(customer.description == null)
        txtDescription.style.border = initial;
    if(customer.points == null)
        txtPoints.style.border = initial;
    if(customer.landno == null)
        txtLand.style.border= initial;
}

function getUpdates() {

    var updates = "";

    if (customer != null && oldcustomer != null) {

        if (customer.fname != oldcustomer.fname)
            updates = updates + "\nFirst Name is Changed";

        if (customer.lname != oldcustomer.lname)
            updates = updates + "\nLast Name is Changed";

        if (customer.nic != oldcustomer.nic)
            updates = updates + "\nNIC is Changed";

        if (customer.email != oldcustomer.email)
            updates = updates + "\nEmail is Changed";

        if (customer.mobileno != oldcustomer.mobileno)
            updates = updates + "\nMobile No is Changed";

        if (customer.landno != oldcustomer.landno)
            updates = updates + "\nLand No is Changed";

        if (customer.address != oldcustomer.address)
            updates = updates + "\nAddress is Changed";

        if (customer.points != oldcustomer.points)
            updates = updates + "\nPoints are Changed";

        if (customer.description != oldcustomer.description)
            updates = updates + "\nDescription is Changed";

        if (customer.customerstatus_id1.name != oldcustomer.customerstatus_id1.name)
            updates = updates + "\nCustomer Status is Changed";
    }

    return updates;

}

function btnUpdateMC() {
    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == "")
            swal({
                title: 'Nothing Updated..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        else {
            swal({
                title: "Are you sure to update following Customer details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/customer", "PUT", customer);
                        if (response == "0") {
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Your work has been Done \n Update SuccessFully..!',
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                            loadSearchedTable();
                            loadForm();
                            $('#mainform').modal('hide');

                        } else window.alert("Failed to Update as \n\n" + response);
                    }
                });
        }
    } else
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getErrors(),
            button: true
        });

}

function btnDeleteMC(custom) {
    customer = JSON.parse(JSON.stringify(custom));

    swal({
        title: "Are you sure to delete following employee...?",
        text: "\n Customer First Name : " + customer.fname +
            "\n Customer Last Name : " + customer.lname +
            "\n Customer Points : " + customer.points,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/customer", "DELETE", customer);
            if (responce == 0) {
                swal({
                    title: "Deleted Successfully....!",
                    text: "\n\n  Status change to delete",
                    icon: "success", button: false, timer: 1200,
                });
                loadSearchedTable();
                loadForm();
            } else {
                swal({
                    title: "You have following erros....!",
                    text: "\n\n" + responce,
                    icon: "error", button: true,
                });
            }
        }
    });

}

function loadSearchedTable() {

    var searchtext = txtSearchName.value;

    var query = "&searchtext=";

    if (searchtext != "")
        query = "&searchtext=" + searchtext;
    //window.alert(query);
    loadTable(activepage, cmbPageSize.value, query);

    disableButtons(false, true, true);

}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC(customer) {

    var newwindow = window.open();
    formattab = tblCustomer.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Customer Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function sortTable(cind) {
    cindex = cind;

    var cprop = tblEmployee.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        employees.sort(
            function (a, b) {
                if (a[cprop] < b[cprop]) {
                    return -1;
                } else if (a[cprop] > b[cprop]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    } else {
        employees.sort(
            function (a, b) {
                if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] < b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return -1;
                } else if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] > b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    }
    fillTable('tblEmployee', employees, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblEmployee);
    loadForm();

    if (activerowno != "") selectRow(tblEmployee, activerowno, active);


}