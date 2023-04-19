window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {

    //tooltip
    $('[data-toggle="tooltip"]').tooltip();
    $('.js-example-basic-single').select2();
    //popover for info buttons
    $('[data-toggle="popover"]').popover();
    $('.popover-dismiss').popover({
        trigger: 'focus'
    })

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    //dteDOBirth.onchange = dteDOBirthCH;
    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=SUPPLIERRETURN", "GET");
    employees = httpRequest("../employee/list", "GET");

    supplierreturnstatuses = httpRequest("../supplierReturnstatus/list" , "GET");

    suppliers = httpRequest("../supplier/list" , "GET");
    supplierreturns = httpRequest("../supreturn/list" , "GET");
    items = httpRequest("../item/list" , "GET");

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
    supreturn = new Object();
    oldsupreturn = null;

    //create a new array (INNER FORM)
    supreturn.supplierReturnHasItemList= new Array();

    fillCombo(cmbSupplier , "Select supplier" , suppliers , "companyfullname" , "");

    fillCombo(cmbStatus, "", supplierreturnstatuses, "name", "Active");
    fillCombo(cmbAddedBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    supreturn.returnstatus_id = JSON.parse(cmbStatus.value);
    cmbStatus.disabled = true;
    supreturn.employee_id = JSON.parse(cmbAddedBy.value);

    dteAddeddate.value = getCurrentTimeDate("date");
    supreturn.addeddate = dteAddeddate.value;
    dteAddeddate.disabled = true;

    supreturn.description = txtDescription.value;

    txtTotalamount.value = "";
    txtDescription.value = "";

    //Get Next Number Form Data Base
    var nextNumber = httpRequest("/supreturn/nextnumber", "GET");
    txtSupRetCode.value = nextNumber.supreturncode;
    supreturn.supreturncode = txtSupRetCode.value;
    txtSupRetCode.disabled = "disabled";


    setStyle(initial);
    dteAddeddate.style.border = valid;
    cmbStatus.style.border = valid;
    cmbAddedBy.style.border = valid;
    txtSupRetCode.style.border = valid;

    disableButtons(false, true, true);
    //calling the inner form function
    refreshInnerForm();
}

function cmbSuppiler(){

    if(supreturn.supplierReturnHasItemList.length != 0 ){
        selectedsupplier = JSON.parse(cmbSupplier.value);
        swal({
            title: "Table Has Some Values. Do You Want to Discard them ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                supreturn.supplierReturnHasItemList = [];
                fillInnerTable("tblInnerItem" , supreturn.supplierReturnHasItemList , innerModify , innerDelete, innerView);
            }else{
                fillCombo(cmbSupplier ,"" , activesuppliers ,"companyfullname" , selectedsupplier.companyfullname );
                cmbSupplier.style.border = "updated";
            }
        });
    }else{
        cmbItems.style.border = "initial";
    }

    itemsbysupplier = httpRequest("/item/listBySupplier?supplierid="+JSON.parse(cmbSupplier.value).id , "GET");
    fillCombo(cmbItems , "Select Items" , itemsbysupplier , "itemname" , "" );



    cmbItems.style.border = initial;
    cmbBatch.style.border = initial;
    cmbItems.style.border = initial;
    txtPurchase.style.border = initial;
    txtQty.style.border = initial;
    txtLineTotal.style.border = initial;
    cmbReturnReason.style.border = initial;

    cmbBatch.value = "";
    cmbItems.value = "";
    txtPurchase.value = "";
    txtQty.value = "";
    txtLineTotal.value = "";
    cmbReturnReason.value = "";

}

function txtPurchaseCH(){
    if (txtQty.value != ""){
        txtLineTotal.value = (parseFloat(txtPurchase.value) * parseFloat(txtQty.value)).toFixed(2);
        txtLineTotal.style.border = valid;
        supplierReturnHasItem.linetotal = txtLineTotal.value;
    }else{
        txtLineTotal.value = "";
    }

}

function cmbItemsCH(){

    batchesByItemSupplier = httpRequest("/batch/listBySI?supplierid="+JSON.parse(cmbSupplier.value).id+"&itemid="+JSON.parse(cmbItems.value).id, "GET");
    fillCombo(cmbBatch , 'Select Batch' , batchesByItemSupplier , 'batchnumber' , "");

    cmbBatch.disabled = false;

    txtPurchase.value = "";
    txtQty.value = "";
    txtLineTotal.value = "";
    cmbReturnReason.value = "";

    cmbBatch.style.border = initial;
    txtPurchase.style.border = initial;
    txtQty.style.border = initial;
    txtLineTotal.style.border = initial;
    cmbReturnReason.style.border = initial;
}

function txtQuantityCH(){

    if((parseFloat(txtQty.value) > JSON.parse(cmbBatch.value).availableqty)){
        swal({
            title: "Quantity cannot be exeed the limit !!!",
            text: "\n",
            icon: "error",
            time:1200,
            button:false,
            dangerMode: true,
        });
        txtQty.value = "";
        txtQty.style.border = invalid;
        txtLineTotal.value = "";
        txtLineTotal.style.border = initial;

    }

    if (txtPurchase.value != ""){
        txtLineTotal.value = (parseFloat(txtPurchase.value) * parseFloat(txtQty.value)).toFixed(2);
        txtLineTotal.style.border = valid;
        supplierReturnHasItem.linetotal = txtLineTotal.value;
    }else{
        txtLineTotal.value = "";
    }
}

function cmbSelectBatchCH(){
    txtPurchase.value = JSON.parse(cmbBatch.value).purchaseprice;
    txtPurchase.style.border = valid;
    supplierReturnHasItem.purchaseprice = txtPurchase.value;

    txtavailbleqty.innerHTML = JSON.parse(cmbBatch.value).availableqty;

    if(parseFloat(JSON.parse(cmbBatch.value).availableqty) == 0){
        txtQty.disabled = true;
        txtQty.style.border = invalid;
        availableqty.style.color = "#FF0000";

    }else{
        txtQty.disabled = false;
        txtQty.style.border = initial;
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

//loading the table in supplier page
function loadTable(page, size, query) {
    page = page - 1;
    supplierreturns = new Array();
    var data = httpRequest("/supreturn/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) supplierreturns = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblSupplierReturn', supplierreturns, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblSupplierReturn);

    if (activerowno != "") selectRow(tblSupplierReturn, activerowno, active);

}

//INNER FORM FUNCTIONS//////////////////////////////////////////////////////////////////////////////

//FILLING THE INNER FORM AND TABLE
function refreshInnerForm(){
    supplierReturnHasItem = new Object();
    oldsupplierReturnHasItem = null;

    totalamount = 0;

    returnreasons = httpRequest("../returnreason/list" , "GET");
    fillCombo(cmbReturnReason , 'Select Reason' , returnreasons , 'name' , '' );

    batches = httpRequest("../batch/list" , "GET");
    fillCombo(cmbBatch , 'Select Batch' , batches , 'batchnumber' , '');

    txtPurchase.value = "";
    txtQty.value = "";
    txtLineTotal.value = "";


    cmbItems.style.border=initial;
    cmbBatch.style.border = initial;
    txtPurchase.style.border = initial;
    txtQty.style.border = initial;
    txtLineTotal.style.border = initial;
    cmbReturnReason.style.border = initial;

    checkSupRetItems();

    //calculate total amount when adding items to to the inner form
    if(supreturn.supplierReturnHasItemList.length != 0){
        for(var index in supreturn.supplierReturnHasItemList){
            totalamount = (parseFloat(totalamount) + parseFloat(supreturn.supplierReturnHasItemList[index].linetotal)).toFixed(2);
        }

        txtTotalamount.value = totalamount;
        supreturn.totalamount = txtTotalamount.value;
        if(oldsupreturn != null && supreturn.totalamount != oldsupreturn.totalamount){
            txtTotalamount.style.border = updated;
        }else{
            txtTotalamount.style.border = valid;
        }
    }

    //INNER TABLE
    fillInnerTable("tblInnerSupReturn" , supreturn.supplierReturnHasItemList , innerModify , innerDelete, innerView);
    if(supreturn.supplierReturnHasItemList.length != 0){
        for(var index in supreturn.supplierReturnHasItemList){
            tblInnerSupReturn.children[1].children[index].lastChild.children[0].style.display = "none";
        }
    }
}

function checkSupRetItems() {
    if(cmbSupplier.value != ""){
        cmbSupplier.disabled = false;
        itemsbysupplierid = httpRequest("/item/listBySupplier?supplierid=" + JSON.parse(cmbSupplier.value).id , "GET");
        fillCombo(cmbItems , "Select Items" , itemsbysupplierid , "itemname", "");
    }
}

function btnInnerAddMC(){

    var itmExist = false;

    if(cmbItems.value == "" || cmbBatch.value == "" || txtPurchase.value == "" || txtQty.value == "" || cmbReturnReason.value == "" ){
        swal({
            title: "Some Fields Have Empty !!!",
            text: "\n",
            icon: "warning",
            time:1200,
            button:false,
            dangerMode: true,
        });
    }else if (txtQty.value == "0"){
        swal({
            title: "Quantity cannot be zero !!!",
            text: "\n",
            icon: "error",
            time:1200,
            button:false,
            dangerMode: true,
        });
    }
    else{
        for(var index in supreturn.supplierReturnHasItemList){
            if(supreturn.supplierReturnHasItemList[index].batch_id.batchnumber == supplierReturnHasItem.batch_id.batchnumber){
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
            supreturn.supplierReturnHasItemList.push(supplierReturnHasItem);
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
            supreturn.supplierReturnHasItemList.splice(innerrow, 1);
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
function viewitem(supr, rowno) {
    supret = JSON.parse(JSON.stringify(supr));

    tdsupretcode.innerHTML = supret.supreturncode;
    tdSupplier.innerHTML = supret.supplier_id.companyfullname;
    tdTotalAmount.innerHTML = supret.totalamount;

    if(supret.description == null){
        tdDescription.innerHTML = "-";
    }else{
        tdDescription.innerHTML = supret.description;
    }
    tdAddedBy.innerHTML = supret.employee_id.callingname;
    tdAdded.innerHTML = supret.addeddate;
    tdStatus.innerHTML = supret.returnstatus_id.name;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    tdPrinted.innerHTML = date+' '+time;

    fillInnerTable("tblInnerPrintSupReturn" , supret.supplierReturnHasItemList , innerModify , innerDelete, innerView);

    $('#dataViewModel').modal('show')

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
        "<div class='col-md-12 ml-3 mt-2'><span style='text-align: left ; font-size: x-large ; font-weight: bold'>Supplier Return Details</span></div>"+
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

    cmbSupplier.style.border = style;
    txtTotalamount.style.border = style;
    txtDescription.style.border = style;
    cmbAddedBy.style.border = style;
    dteAddeddate.style.border = style;
    cmbStatus.style.border = style;

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
    for (index in supplierreturns) {
        if (supplierreturns[index].returnstatus_id.name == "Cancelled") {
            tblSupplierReturn.children[1].children[index].style.color = "#f00";
            tblSupplierReturn.children[1].children[index].style.border = "2px solid red";
            tblSupplierReturn.children[1].children[index].lastChild.children[1].disabled = true;
            tblSupplierReturn.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    /*if (quatation.quatationrequest_id.== null)
        errors = errors + "\n" + "Please select the quatation request ID";
    else addvalue = 1;*/

    if (supreturn.supplier_id == null)
        errors = errors + "\n" + "Please Select a Supplier";
    else addvalue = 1;

    if(supreturn.supplierReturnHasItemList.length == 0){
        cmbItems.style.border = invalid;
        errors = errors + "\n" + "Return items are empty";
    }

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtDescription.value == "" ) {
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
        title: "Are you sure to add following Supplier Return List...?",
        text: "\nSupplier Return Code : " + supreturn.supreturncode +
            "\nSupplier Name : " + supreturn.supplier_id.companyfullname +
            "\nTotal Amount : " + supreturn.totalamount +
            "\nReturn Status : " + supreturn.returnstatus_id,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/supreturn", "POST", supreturn);
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
                refreshInnerForm();
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

    if (oldsupreturn == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form Has Some Values, Updates Values... Are You Sure to Discard The Form ?",
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
function fillForm(supret, rowno) {
    activepage = rowno;

    if (oldsupreturn == null) {
        filldata(supret);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(supret);
            }

        });
    }

}

//fill data to the form
function filldata(supret) {
    clearSelection(tblSupplierReturn);
    selectRow(tblSupplierReturn, activepage, active);

    supreturn = JSON.parse(JSON.stringify(supret));
    oldsupreturn = JSON.parse(JSON.stringify(supret));

    //cannot change
    fillCombo(cmbSupplier , "" , suppliers , "companyfullname" , supreturn.supplier_id.companyfullname);
    cmbSupplier.disabled = "disabled";

    //cannot change
    txtTotalamount.value = supreturn.totalamount;
    txtTotalamount.disabled = "disabled";

    //cannot change
    dteAddeddate.value = supreturn.addeddate;
    dteAddeddate.disabled = "disabled" ;

    fillCombo(cmbStatus , "" , supplierreturnstatuses , "name" , supreturn.returnstatus_id.name);
    cmbStatus.disabled = false;

    //cannot change
    fillCombo(cmbAddedBy, "" , employees , "callingname" , supreturn.employee_id.callingname);
    cmbAddedBy.disabled = "disabled";

    fillCombo(cmbItems , "Select Items" , "itemname" , )

    txtDescription.value = supreturn.description;

    disableButtons(true, false, false);
    setStyle(valid);
    $('#mainform').modal('show');

    //OPTIONAL FIELDS
    if(supreturn.txtDescription == null)
        txtDescription.style.border = initial;
    // refresh inner
    refreshInnerForm();
}

function getUpdates() {

    var updates = "";

    if (supreturn != null && oldsupreturn != null) {

        if (supreturn.totalamount != oldsupreturn.totalamount)
            updates = updates + "\nTotal amount is  Changed";

        if (supreturn.supplier_id.companyfullname != oldsupreturn.supplier_id.companyfullname)
            updates = updates + "\nSupplier is Changed";

        if (supreturn.description != oldsupreturn.description)
            updates = updates + "\nDescription is Changed";

        if (supreturn.returnstatus_id.name != oldsupreturn.returnstatus_id.name)
            updates = updates + "\nSupplier Return Status is Changed";

        if(isEqual(supreturn.supplierReturnHasItemList , oldsupreturn.supplierReturnHasItemList , "item_id"))
            updates = updates + "\nQuatation Item is Changed";
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
                title: "Are You Sure to Update Following Supplier Return details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/supreturn", "PUT", supreturn);
                        if (response == "0") {
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Your work has been Done \n Update SuccessFully..!',
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                            loadView();
                            loadForm();
                            refreshInnerForm();
                            $('#mainform').modal('hide');

                        } else window.alert("Failed to Update as \n\n" + response);
                    }
                });
        }
    } else
        swal({
            title: 'You Have Following Errors In Your Form', icon: "error",
            text: '\n ' + getErrors(),
            button: true
        });

}

function btnDeleteMC(spr) {
    supreturn = JSON.parse(JSON.stringify(spr));

    swal({
        title: "Are You Sure to Delete Following Supplier Return List...?",
        text:"\nSupplier Return Code : " + supreturn.supreturncode +
            "\n Supplier : " + supreturn.supplier_id.companyfullname +
            "\nTotal Amount : " + supreturn.totalamount +
            "\n Supplier Return Status : " + supreturn.returnstatus_id.name,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/supreturn", "DELETE", supreturn);
            if (responce == 0) {
                swal({
                    title: "Deleted Successfully....!",
                    text: "\n\n  Status Changed to Cancelled",
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

function btnPrintTableMC(supr) {

    var newwindow = window.open();
    formattab = tblSupplierReturn.outerHTML;

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
        "<div class='col-md-12 ml-3 mt-2'><span style='text-align: left ; font-size: x-large ; font-weight: bold'>Supplier Return Details</span></div>"+
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