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

    privilages = httpRequest("../privilage?module=SUPPLIER", "GET");
    employees = httpRequest("../employee/list", "GET");
    supplierstatuses = httpRequest("supplierstatus/list", "GET");
    suppliers = httpRequest("../supplier/list" , "GET");
    items = httpRequest("../item/availableItemList" , "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2"; //d6d6c2
    updated = "2px solid #ff9900";
    active = "#ff9900";

    loadView();
    loadForm();


}

//auto load require values to the form

function loadForm() {
    supplier = new Object();
    oldsupplier = null;

    //create a new array (INNER FORM)
    supplier.supplierHasItemList = new Array();

    fillCombo(cmbStatus, "", supplierstatuses, "name", "New");
    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    supplier.supplierstatus_id = JSON.parse(cmbStatus.value);
    cmbStatus.disabled = true;

    supplier.employee_id = JSON.parse(cmbEmployee.value);
    cmbEmployee.disabled = true;

    var today = new Date();
    var month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = today.getDate();
    if (date < 10) date = "0" + date;

    dteDate.value = today.getFullYear() + "-" + month + "-" + date;
    supplier.addeddate = dteDate.value;
    dteDate.disabled = true;

    //Get Next Number Form Data Base
    var nextNumber = httpRequest("/supplier/nextnumber", "GET");
    regNo.value = nextNumber.regno;
    supplier.regno = regNo.value;
    regNo.disabled = "disabled";

    txtCreditLimit.value="0.00";
    supplier.creditlimit = txtCreditLimit.value;

    txtAreasAmount.value= 0;
    txtAreasAmount.disabled = true;
    txtAreasAmount.style.border = valid;
    supplier.areasamount = txtAreasAmount.value;

    txtComName.value = "";
    txtLandNo.value="";
    txtEmail.value="";
    txtAddress.value="";
    txtComRegNo.value="";
    txtComPersonName.value="";
    txtComPersonCon.value="";
    txtBankAccNo.value="";
    txtBankAccName.value="";
    txtBankName.value="";
    txtBankBranch.value="";

    txtDescription.value="";
    // removeFile('flePhoto');

    setStyle(initial);
    dteDate.style.border = valid;
    cmbEmployee.style.border = valid;
    cmbStatus.style.border = valid;
    regNo.style.border = valid;

    disableButtons(false, true, true);
    //calling the inner form function
    refreshInnerForm();
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

//loading the table in supplier page
function loadTable(page, size, query) {
    page = page - 1;
    suppliers = new Array();
    var data = httpRequest("/supplier/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) suppliers = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblSupplier', suppliers, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblSupplier);

    if (activerowno != "") selectRow(tblSupplier, activerowno, active);

}

//INNER FORM FUNCTIONS//////////////////////////////////////////////////////////////////////////////

//FILLING THE INNER FORM AND TABLE
function refreshInnerForm(){
    supplierHasItem = new Object();
    oldsupplierHasItem = null;

    //INNER FORM
    //AUTO FILL DATA
    fillCombo(selectItem,"Select Item",items,"itemname","");

    //setStyle(initial);
    selectItem.style.border=initial;

    //INNER TABLE
    fillInnerTable("tblInnerItem" , supplier.supplierHasItemList , innerModify , innerDelete, innerView);
    if(supplier.supplierHasItemList.length != 0){
        for(var index in supplier.supplierHasItemList){
            tblInnerItem.children[1].children[index].lastChild.children[0].style.display = "none";
        }
    }
}

function btnInnerAddMC(){

    var itmExist = false;

    if(selectItem.value == ""){
        swal({
            title: "Some Fields Have Empty !!!",
            text: "\n",
            icon: "warning",
            time:1200,
            button:false,
            dangerMode: true,
        });
    }else{
        for(var index in supplier.supplierHasItemList){
            if(supplier.supplierHasItemList[index].item_id.itemname == supplierHasItem.item_id.itemname){
                var itmExist = true;
                break;
            }
        }

        if(itmExist){
            swal({
                title: "Already Exists !!!",
                text: "\n",
                icon: "warning",
                time:1200,
                button:false,
                dangerMode: true,
            });

        }else{
            supplier.supplierHasItemList.push(supplierHasItem);
            refreshInnerForm();
        }

    }



}

function innerModify(){

}
function innerDelete(innerob , innerrow){
    swal({
        title: "Are You Sure to Delete Item??",
        text: "\n"  + innerob.item_id.itemname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            supplier.supplierHasItemList.splice(innerrow, 1);
            refreshInnerForm();
        }

    });

}
function innerView(){

}

//INNER FORM FUNCTIONS//////////////////////////////////////////////////////////////////////////////

function paginate(page) {
    var paginate;
    if (oldsupplier == null) {
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
function viewitem(sup, rowno) {

    supview = JSON.parse(JSON.stringify(sup));

    tdregNo.innerHTML = supview.regno;
    tdComName.innerHTML = supview.companyfullname;
    tdContact.innerHTML = supview.landno;
    tdEmail.innerHTML = supview.email;
    tdAddress.innerHTML = supview.address;

    if(supview.companyregno == null){
        tdComReg.innerHTML = "-";
    }else{
        tdComReg.innerHTML = supview.companyregno;
    }

    tdCPName.innerHTML = supview.cpname;
    tdCPContact.innerHTML = supview.cpmobile;

    if(supview.bankaccno == null){
        tdBankNo.innerHTML = "-";
    }else{
        tdBankNo.innerHTML = supview.bankaccno;
    }

    if(supview.bankaccname == null){
        tdBankAccName.innerHTML = "-";
    }else{
        tdBankAccName.innerHTML = supview.bankaccname;
    }

    if(supview.bankname == null){
        tdBankName.innerHTML = "-";
    }else{
        tdBankName.innerHTML = supview.bankname;
    }

    if(supview.bankbranchname == null){
        tdBranch.innerHTML = "-";
    }else{
        tdBranch.innerHTML = supview.bankbranchname;
    }

    tdCredit.innerHTML = supview.creditlimit;

    if(supview.areasamount == null){
        tdAreas.innerHTML = "-";
    }else{
        tdAreas.innerHTML = supview.areasamount;
    }

    if(supview.description == null){
        tdDescription.innerHTML = "-";
    }else{
        tdDescription.innerHTML = supview.description;
    }

    tdAddedBy.innerHTML = supview.employee_id.callingname;
    tdStatus.innerHTML = supview.supplierstatus_id.name;
    tdAdded.innerHTML = supview.addeddate;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    tdPrinted.innerHTML = date+' '+time;

    fillInnerTable("printInnerTable" , supview.supplierHasItemList , innerModify , innerDelete, innerView);

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
        "<body><div style='margin-top: 100px'>" +
        "<div class='row'>" +
        "<div class='col-md-8'>" +
        "<div style='font-weight: bold ; text-align: right ; font-size: xx-large'>OMEL LANKA Super Market</div>"+
        "</div>"+
        "<div class='col-md-4'>" +
        "<img src='resources/image/favicon.png' width='50px' height='50px' style='text-align: center'>"+
        "</div>"+
        "</div>"+
        "<div class='row'>" +
        "<div class='col-md-12 ml-3 mt-2'><span style='text-align: left ; font-size: x-large ; font-weight: bold'>Supplier Details</span></div>"+
        "</div>"+
         "</div>"+
        "</div>"+
        "</div>" +
        "<div>" + format + "</div>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}
//set styles to the form

function setStyle(style) {

    regNo.style.border = style;
    txtComName.style.border = style;
    txtLandNo.style.border = style;
    txtEmail.style.border = style;
    txtAddress.style.border = style;
    txtComRegNo.style.border = style;
    txtComPersonName.style.border = style;
    txtComPersonCon.style.border = style;
    txtBankAccNo.style.border = style;
    txtBankAccName.style.border = style;
    txtBankName.style.border = style;
    txtBankBranch.style.border = style;
    txtCreditLimit.style.border = style;
    txtAreasAmount.style.border = style;
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
    for (index in suppliers) {
        if (suppliers[index].supplierstatus_id.name == "Deleted") {
            tblSupplier.children[1].children[index].style.color = "#f00";
            tblSupplier.children[1].children[index].style.border = "2px solid red";
            tblSupplier.children[1].children[index].lastChild.children[1].disabled = true;
            tblSupplier.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (supplier.companyfullname == null) {
        errors = errors + "\n" + "Please Enter Company Name";
        txtComName.style.border = invalid;
    }
    else addvalue = 1;

    if (supplier.landno == null) {
        errors = errors + "\n" + "Please Enter Company Contact No";
        txtLandNo.style.border = invalid;
    }
    else addvalue = 1;

    if (supplier.email == null) {
        errors = errors + "\n" + "Enter Valid Email Address";
        txtEmail.style.border = invalid;
    }
    else addvalue = 1;

    if (supplier.address == null) {
        errors = errors + "\n" + "Please Enter Address";
        txtAddress.style.border = invalid;
    }
    else addvalue = 1;

    if (supplier.cpname == null) {
        errors = errors + "\n" + "Please Enter Company Person Name";
        txtComPersonName.style.border = invalid;
    }
    else addvalue = 1;

    if (supplier.cpmobile == null) {
        errors = errors + "\n" + "Please Enter Company Person Contact No";
        txtComPersonCon.style.border = invalid;
    }
    else addvalue = 1;

    if (supplier.creditlimit == null) {
        errors = errors + "\n" + "Please Enter A Credit Limit";
        txtCreditLimit.style.border = invalid;
    }
    else addvalue = 1;

    if(supplier.supplierHasItemList.length == 0){
        selectItem.style.border = invalid;
        errors = errors + "\n" + "Supplier Items Not Inserted";
    }

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtComRegNo.value == ""      || txtBankAccNo.value == "" || txtBankAccName.value == "" || txtBankName.value == "" || txtBankBranch.value == "" || txtAreasAmount.value == "" || txtDescription.value == "" ) {
            swal({
                title: "Are You Sure To Continue...?",
                text: "Form Has Some Empty Fields.....",
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
        title: "Are You Sure To Add Following Supplier...?",
        text: "\nRegistration No : " + supplier.regno +
            "\nCompany Name : " + supplier.companyfullname +
            "\nContact No : " + supplier.landno +
            "\nEmail : " + supplier.email +
            "\nAddress : " + supplier.address +
            "\nCompany Person Name : " + supplier.cpname +
            "\nCompany Person Contact No : " + supplier.cpmobile +
            "\nCredit Limit : " + supplier.creditlimit +
            "\nAdded Date : " + supplier.addeddate +
            "\nStatus : " + supplier.supplierstatus_id.name,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/supplier", "POST", supplier);
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

    if (oldsupplier == null && addvalue == "" && selectItem.value == "") {
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
function fillForm(sup, rowno) {
    activepage = rowno;

    if (oldsupplier == null) {
        filldata(sup);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(sup);
            }

        });
    }

}

//fill data to the form
function filldata(sup) {
    clearSelection(tblSupplier);
    selectRow(tblSupplier, activepage, active);

    supplier = JSON.parse(JSON.stringify(sup));
    oldsupplier = JSON.parse(JSON.stringify(sup));

    //cannot change
    regNo.value = supplier.regno;
    regNo.disabled = "disabled";

    //cannot change
    dteDate.value = supplier.addeddate;
    dteDate.disabled = "disabled" ;

    //cannot change
    fillCombo(cmbEmployee, "" , employees , "callingname" , supplier.employee_id.callingname);
    cmbEmployee.disabled = "disabled";

    fillCombo(cmbStatus , "" , supplierstatuses , "name" , supplier.supplierstatus_id.name);
    cmbStatus.disabled = false;

    txtComName.value = supplier.companyfullname;
    txtLandNo.value = supplier.landno;
    txtEmail.value = supplier.email;
    txtAddress.value = supplier.address;
    txtComPersonName.value = supplier.cpname;
    txtComPersonCon.value = supplier.cpmobile;
    txtCreditLimit.value = supplier.creditlimit;
    txtComRegNo.value = supplier.companyregno;
    txtBankAccNo.value = supplier.bankaccno;
    txtBankAccName.value = supplier.bankaccname;
    txtBankName.value = supplier.bankname;
    txtBankBranch.value = supplier.bankbranchname;
    txtAreasAmount.value = supplier.areasamount;
    txtDescription.value = supplier.description;

    disableButtons(true, false, false);
    setStyle(valid);
    $('#mainform').modal('show');

    //OPTIONAL FIELDS
    if(supplier.companyregno == null)
        txtComRegNo.style.border = initial;
    if(supplier.bankaccno == null)
        txtBankAccNo.style.border= initial;
    if(supplier.bankaccname == null)
        txtBankAccName.style.border= initial;
    if(supplier.bankname == null)
        txtBankName.style.border= initial;
    if(supplier.bankbranchname == null)
        txtBankBranch.style.border= initial;
    if(supplier.description == null)
        txtDescription.style.border= initial;
    if(supplier.areasamount == null)
        txtAreasAmount.style.border= initial;

    // refresh inner
    refreshInnerForm();
}

function getUpdates() {

    var updates = "";

    if (supplier != null && oldsupplier != null) {

        if (supplier.companyfullname != oldsupplier.companyfullname)
            updates = updates + "\nCompany Name is Changed";

        if (supplier.landno != oldsupplier.landno)
            updates = updates + "\nCompany Contact No is Changed";

        if (supplier.email != oldsupplier.email)
            updates = updates + "\nEmail is Changed";

        if (supplier.address != oldsupplier.address)
            updates = updates + "\nAddress is Changed";

        if (supplier.cpname != oldsupplier.cpname)
            updates = updates + "\nCompnay Person is Changed";

        if (supplier.cpmobile != oldsupplier.cpmobile)
            updates = updates + "\nCompnay Person Contact No is Changed";

        if (supplier.creditlimit != oldsupplier.creditlimit)
            updates = updates + "\nCredit Limit is Changed";

        if (supplier.companyregno != oldsupplier.companyregno)
            updates = updates + "\nCompany Register No is Changed";

        if (supplier.bankaccname != oldsupplier.bankaccname)
            updates = updates + "\nBank Account Name is Changed";

        if (supplier.bankaccno != oldsupplier.bankaccno)
            updates = updates + "\nBank Account No is Changed";

        if (supplier.bankname != oldsupplier.bankname)
            updates = updates + "\nBank is Changed";

        if (supplier.bankbranchname != oldsupplier.bankbranchname)
            updates = updates + "\nBank Branch is Changed";

        if (supplier.areasamount != oldsupplier.areasamount)
            updates = updates + "\nAreas Amount is Changed";

        if (supplier.description != oldsupplier.description)
            updates = updates + "\nDescription is Changed";

        if (supplier.supplierstatus_id.name != oldsupplier.supplierstatus_id.name)
            updates = updates + "\nSupplier Status is Changed";

        if(isEqual(supplier.supplierHasItemList , oldsupplier.supplierHasItemList , "item_id"))
            updates = updates + "\nSupply Item is Changed";

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
                title: "Are you Sure to Update Following Supplier Details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/supplier", "PUT", supplier);
                        if (response == "0") {
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Your Work Has Been Done \n Update SuccessFully..!',
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                            loadView();
                            loadForm();
                            $('#mainform').modal('hide');

                        } else window.alert("Failed to Update as \n\n" + response);
                    }
                });
        }
    } else
        swal({
            title: 'You Have Following Errors in Your Form', icon: "error",
            text: '\n ' + getErrors(),
            button: true
        });

}

function btnDeleteMC(sup) {
    supplier = JSON.parse(JSON.stringify(sup));

    swal({
        title: "Are You Sure to Delete Following Supplier...?",
        text: "\nReg No : " + supplier.regno +
            "\n Company Name : " + supplier.companyfullname +
            "\n Address : " + supplier.address+
            "\n Company Person : " + supplier.cpname+
            "\n Supplier Status : " + supplier.supplierstatus_id.name+
            "\n Added Date : " + supplier.addeddate,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/supplier", "DELETE", supplier);
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
                    title: "You Have Following Erros....!",
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

function btnPrintTableMC(supplier) {

    var newwindow = window.open();
    formattab = tblSupplier.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 75px'>" +
        "<div class='row'>" +
        "<div class='col-md-8'>" +
        "<div style='font-weight: bold ; text-align: right ; font-size: xx-large'>OMEL LANKA Super Market</div>"+
        "</div>"+
        "<div class='col-md-4'>" +
        "<img src='resources/image/favicon.png' width='50px' height='50px' style='text-align: center'>"+
        "</div>"+
        "</div>"+
        "<div class='row' style='margin-bottom: 10px'>" +
        "<div class='col-md-12 ml-3 mt-2'><span style='text-align: left ; font-size: x-large ; font-weight: bold'>Supplier Details</span></div>"+
        "</div>"+
        "</div>"+
        "</div>"+
        "</div>" +
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