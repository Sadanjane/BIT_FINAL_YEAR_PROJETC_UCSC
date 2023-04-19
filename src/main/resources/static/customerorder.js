window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {

    //tooltip
    $('[data-toggle="tooltip"]').tooltip();
    $('.modal-backdrop').remove();

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    //dteDOBirth.onchange = dteDOBirthCH;
    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=CUSTOMERORDER", "GET");

    employees = httpRequest("../employee/list", "GET");
    corderstatuses = httpRequest("../customerorderstatus/list" , "GET");
    customers = httpRequest("../customer/ActiveCus" , "GET");
    activeitems = httpRequest("../item/list" , "GET");
    corders = httpRequest("../customerorder/list" , "GET");


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
    corder = new Object();
    oldcorder = null;

    //create a new array (INNER FORM)
    corder.orderHasItemList = new Array();

    //fill data and auto bind
    fillCombo(cmbStatus, "", corderstatuses , "name", "Ordered");
    fillCombo(cmbAddedBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    corder.customerorderstatus_id = JSON.parse(cmbStatus.value);
    cmbStatus.disabled = true;

    corder.employee_id = JSON.parse(cmbAddedBy.value);
    cmbAddedBy.disabled = true;

    dteRequiredDate.min = getCurrentTimeDate("date");
    let validTo = new Date();
    validTo.setDate(validTo.getDate() + 30);
    dteRequiredDate.max = validTo.getFullYear() + "-" + getmonthdate(validTo);


    dteAddedDate.value = getCurrentTimeDate("date");
    corder.addeddate = dteAddedDate.value;
    dteAddedDate.disabled = true;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/customerorder/nextnumber", "GET");
    txtOrderCode.value = nextNumber.ordercode;
    corder.ordercode = txtOrderCode.value;
    txtOrderCode.disabled = "disabled";

    fillCombo4(cmbCustomer , "Select Customer" , customers , "fname" ,"lname" , "mobileno" ,'');

    dteRequiredDate.value = "";
    txtDescription.value = "";
    txtDiscount.value = "";
    txtTotal.value = "";
    txtTotal.disabled = "disabled";

    // removeFile('flePhoto');

    setStyle(initial);
    cmbStatus.style.border = valid;
    cmbAddedBy.style.border = valid;
    dteAddedDate.style.border = valid;
    txtOrderCode.style.border = valid;
    disableButtons(false, true, true);

    refreshInnerForm();
}

//set styles to the form

function setStyle(style) {

    dteRequiredDate.style.border = style;
    txtDescription.style.border = style;
    txtDiscount.style.border = style;
    txtTotal.style.border = style;


}

//FILLING THE INNER FORM AND TABLE
function refreshInnerForm(){
    corderHasItem = new Object();
    oldcorderHasItem = null;

    batch = new Object();
    oldbatch = null;

    fillCombo(cmbInnerItem , "Select Items" , activeitems , "itemname" , "" );

    //INNER FORM
    //AUTO FILL DATA

    txtInnerQty.value = "";
    txtInnerSalePrice.value = "";
    txtInnerLineTotal.value = "";

    txtInnerQty.style.border = initial;
    txtInnerSalePrice.style.border = initial;
    txtInnerLineTotal.style.border = initial;
    cmbInnerItem.style.border = initial;

    txtInnerQty.disabled = true;
    txtInnerSalePrice.disabled = true;
    txtDiscount.disabled = true;

    //INNER TABLE
    fillInnerTable("tblInnerItem" , corder.orderHasItemList , innerModify , innerDelete, innerView);
    if( corder.orderHasItemList.length != 0){
        for(var index in  corder.orderHasItemList){
            tblInnerItem.children[1].children[index].lastChild.children[0].style.display = "none";
        }
    }

    totalamount = 0;

    //calculate total amount when adding items to to the inner form
    if(corder.orderHasItemList.length != 0){
        for(var index in corder.orderHasItemList){
            totalamount = (parseFloat(totalamount) + parseFloat(corder.orderHasItemList[index].linetotal)).toFixed(2);
        }

        lastprice = totalamount - totalamount*(txtDiscount.value/100);
        txtLastPrice.innerHTML = parseFloat(lastprice).toFixed(2);
        corder.lastprice = lastprice;

        txtTotal.value = totalamount;
        corder.totalamount = txtTotal.value;
        if(oldcorder != null && corder.totalamount != oldcorder.totalamount){
            txtTotal.style.border = updated;
        }else{
            txtTotal.style.border = valid;
        }
    }
}

/*function for auto fill the sales price when selecting an item*/
function itemCH() {

    batches = httpRequest("/batch/listbyItemCO?itemname="+JSON.parse(cmbInnerItem.value).itemname , "GET");
    if(batches != ""){
        txtInnerSalePrice.value = (batches.saleprice).toFixed(2);
        txtInnerSalePrice.style.border = valid;
        corderHasItem.saleprice = txtInnerSalePrice.value;
        txtInnerSalePrice.disabled = true;
        txtInnerQty.disabled = false;
    }else{
        swal({
            title: "This Item is not available !!!",
            text: "\n",
            icon: "warning",
            time: 1200,
            button: false,
            dangerMode: true,
        });
    }
}

function qtyCH(){

    if(txtInnerQty.value != ""){
        netamount = (JSON.parse(txtInnerQty.value)) * (JSON.parse(txtInnerSalePrice.value)) ;
        txtInnerLineTotal.value = netamount.toFixed(2);
        corderHasItem.linetotal = txtInnerLineTotal.value;
        txtInnerLineTotal.disabled = true;
        txtInnerLineTotal.style.border = valid;
    }else{
        txtInnerLineTotal.value = "";
        txtInnerLineTotal.style.border = initial;
        txtInnerQty.style.border = invalid;

    }
}

//inner form adding
function btnInnerAddMC() {


    var itmExist = false;

    if ((cmbInnerItem.value).name == "" || txtInnerQty.value == "" || txtInnerLineTotal.value == "") {
        swal({
            title: "Some Fields Have Empty !!!",
            text: "\n",
            icon: "warning",
            time: 1200,
            button: false,
            dangerMode: true,
        });
    } else {
        for (var index in corderHasItem.orderHasItemList) {
            if (corderHasItem.orderHasItemList[index].item_id.itemname == corderHasItem.item_id.itemname) {
                var itmExist = true;
                break;
            }
        }

        if (itmExist) {
            swal({
                title: "Already Exists !!!",
                text: "\n",
                icon: "warning",
                time: 1200,
                button: false,
                dangerMode: true,
            });

        } else {
            corder.orderHasItemList.push(corderHasItem);
            refreshInnerForm();
        }

    }

}

function innerModify() {
    
}

function innerDelete () {
    
}

function innerView(){

}

function cuscheck(){
    royaltypoints = httpRequest("../royaltypoint/royalPointsBypoints?points=" + JSON.parse(cmbCustomer.value).points , "GET" );
    txtDiscount.value = parseFloat(royaltypoints.discount).toFixed(2);
    corder.discountrate = txtDiscount.value;
    txtDiscount.style.border = valid;
}

/*calculate the last price when selecting the customer according to the customer loyalty points*/
function calLastPrice(){
    if(corder.orderHasItemList.length != 0){
        lastprice = totalamount - totalamount*(txtDiscount.value/100);
        txtLastPrice.innerHTML = parseFloat(lastprice).toFixed(2);
        corder.lastprice = lastprice;
    }
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

//loading the table in Customer Order page
function loadTable(page, size, query) {
    page = page - 1;
    items = new Array();
    var data = httpRequest("/customerorder/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) items = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblCustomerOrder', items, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblCustomerOrder);

    if (activerowno != "") selectRow(tblCustomerOrder, activerowno, active);
}

function paginate(page) {
    var paginate;
    if (oldcorder == null) {
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
function viewitem(itm, rowno) {

    printitem = JSON.parse(JSON.stringify(itm));

    var volume = printitem.unit_id.name + " " + printitem.unit_id.unitytype_id.name;

    tditemCode.innerHTML = printitem.itemcode;
    tdItemName.innerHTML = printitem.itemname;
    tdRop.innerHTML = printitem.rop;
    tdRoq.innerHTML = printitem.roq;
    tdDescription.innerHTML = printitem.description;
    tdCategory.innerHTML = printitem.subcategory_id.category_id.name;
    tdSubCategory.innerHTML = printitem.subcategory_id.name;
    tdBrand.innerHTML = printitem.brand_id.name;
    tdUnits.innerHTML = volume;
    tdDate.innerHTML = printitem.addeddate;
    tdStatus.innerHTML = printitem.itemstatus_id.name;
    tdAddedBy.innerHTML = printitem.employee_id.callingname;


    $('#dataViewModel').modal('show')

}

function btnPrintRowMC() {
    var format = itemDetailPrintTable.outerHTML;
    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'>" +
        "<body>" +
        "<div>" + format + "</div>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
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
    for (index in corders) {
        if (corders[index].customerorderstatus_id.name == "Deleted") {
            tblCustomerOrder.children[1].children[index].style.color = "#f00";
            tblCustomerOrder.children[1].children[index].style.border = "2px solid red";
            tblCustomerOrder.children[1].children[index].lastChild.children[1].disabled = true;
            tblCustomerOrder.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (cmbCustomer.value == "")
        errors = errors + "\n" + "Please Select the Customer";
    else addvalue = 1;

    if (dteRequiredDate.value == "")
        errors = errors + "\n" + "Please Select the Required Date";
    else addvalue = 1;

    if (corder.orderHasItemList.length == 0)
        errors = errors + "\n" + "Please Select Require Items";
    else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtDescription.value == "") {
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
        title: "Are you sure to Place This Order ?",
        text: "\nOrder No: " + corder.ordercode +
            "\nCustomer : " + corder.customer_id.fname +
            "\nRequire Date: " + corder.requireddate +
            "\nDiscount : " + corder.discountrate +
            "\nTotal: " + corder.totalamount,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/customerorder", "POST", corder);
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

    if (oldcorder == null && addvalue == "") {
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
function fillForm(corder, rowno) {
    activepage = rowno;

    if (oldcorder == null) {
        filldata(corder);
        $('#mainform').modal('show');
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(corder);
            }
            $('#mainform').modal('show');
        });
    }

}

//fill data to the form
function filldata(cord) {

    clearSelection(tblCustomerOrder);
    selectRow(tblCustomerOrder, activepage, active);

    corder = JSON.parse(JSON.stringify(cord));
    oldcorder = JSON.parse(JSON.stringify(cord));

    txtOrderCode.value = corder.ordercode;
    txtOrderCode.disabled = "disabled";

    dteRequiredDate.value = corder.requireddate;
    txtDescription.value = corder.description;

    txtDiscount.value = corder.discountrate;
    txtDiscount.disabled = "disabled";

    txtTotal.value = corder.totalamount;
    txtTotal.disabled = "disabled";

    dteAddedDate.value = corder.addeddate;
    dteAddedDate.disabled = "disabled";

    fillCombo4(cmbCustomer , "" , customers , "fname" , "lname" , "mobileno" , corder.customer_id.fname);
    fillCombo(cmbAddedBy , "" ,  employees , "callingname" , corder.employee_id.callingname);
    fillCombo(cmbStatus , "" , corderstatuses , "name" , corder.customerorderstatus_id.name);

    disableButtons(true, false, false);
    setStyle(valid);
    $('#mainform').modal('hide');

    //OPTIONAL FIELDS
    if(corder.txtDescription == null)
        txtDescription.style.border = initial;

    // refresh inner
    refreshInnerForm();
}

function getUpdates() {

    var updates = "";

    if (corder != null && oldcorder != null) {

        if (corder.customer_id != oldcorder.customer_id)
            updates = updates + "\nCustomer is Changed";

        if (corder.requireddate != oldcorder.requireddate)
            updates = updates + "\nRequired Date is Changed";

        if (corder.description!= oldcorder.description)
            updates = updates + "\nDescription is Changed";

        if (corder.customerorderstatus_id.name != oldcorder.customerorderstatus_id.name)
            updates = updates + "\nCustomer Order Status is Changed";

        if(isEqual(corder.orderHasItemList , oldcorder.orderHasItemList , "customerorder_id"))
            updates = updates + "\nCustomer Order Item is Changed";
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
                title: "Are you sure to update following Customer Order details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/customerorder", "PUT", corder);
                        if (response == "0") {
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Your work has been Done \n Update SuccessFully..!',
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                            /*loadSearchedTable();*/
                            loadView();
                            loadForm();
                            $('#mainform').modal('show');

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

function btnDeleteMC(cod) {
    corder = JSON.parse(JSON.stringify(cod));

    swal({
        title: "Are you sure to delete following Customer Order...?",
        text: "\n Customer : " + cord.customer_id.fname + cord.customer_id.lname +
            "\n Customer Code : " + cord.ordercode +
            "\n Required Date : " + cord.requireddate+
            "\n Customer Order Added By : " + cord.employee_id.callingname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/customerorder", "DELETE", corder);
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

    //
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
    formattab = tblCustomerOrder.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Item Details : </h1></div>" +
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
    fillTable('tblCustomerOrder', items, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblCustomerOrder);
    loadForm();

    if (activerowno != "") selectRow(tblEmployee, activerowno, active);


}