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

    privilages = httpRequest("../privilage?module=PORDER", "GET");
    employees = httpRequest("../employee/list", "GET");
    porderstatuses = httpRequest("../porderstatus/list" , "GET");
    activesuppliers = httpRequest("../supplier/ActiveSup" , "GET");

    items = httpRequest("../item/list" , "GET");
    porders = httpRequest("../porder/list" , "GET");

    quatations = httpRequest("../quatation/list" , "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2"; //d6d6c2
    updated = "2px solid #ff9900";
    active = "#ff9900";

    loadView();
    loadForm();

    //changeTab('form');

}


//auto load require values to the form

function loadForm() {
    porder = new Object();
    oldporder = null;

    //create a new array (INNER FORM)
    porder.porderHasItemList= new Array();

    fillCombo(cmbStatus, "",porderstatuses, "name", "Requested");
    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    fillCombo(cmbSupplier, "Select Supplier" ,activesuppliers, "companyfullname" , "");

    porder.porderstatus_id = JSON.parse(cmbStatus.value);
    cmbStatus.disabled = true;

    porder.employee_id = JSON.parse(cmbEmployee.value);
    cmbEmployee.disabled = true;

    cmbQuatation.disabled = true;

    dterequired.min = getCurrentTimeDate("date");
    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30) // dawas 30k wenkn purchase order require date eka denna puluwan
    dterequired.max = maxDate.getFullYear(maxDate)+"-"+ getmonthdate(maxDate);

    dteDate.value = today.getFullYear() + "-" + month + "-" + day;
    porder.addeddate = dteDate.value;
    dteDate.disabled = true;

    //Get Next Number Form Data Base
    var nextNumber = httpRequest("/porder/nextpod", "GET");
    txtPCode.value = nextNumber.pordercode;
    porder.pordercode = txtPCode.value;
    txtPCode.disabled = "disabled";

    dterequired.value = "";
    txtTotItems.value = "";
    txtDescription.value = "";
    cmbQuatation.value = "";

    setStyle(initial);
    dteDate.style.border = valid;
    cmbEmployee.style.border = valid;
    cmbStatus.style.border = valid;
    txtPCode.style.border = valid;

    disableButtons(false, true, true);
    //calling the inner form function
    refreshInnerForm();
}

function cmbSupplierCH(){

    refreshInnerForm();

    quatationsbyid = httpRequest("/quatation/listBySupplier?supplierid="+JSON.parse(cmbSupplier.value).id , "GET");
    fillCombo(cmbQuatation , "Select Quatation" ,quatationsbyid ,"quatationcode" , "" );

    cmbQuatation.disabled = false;
    cmbQuatation.style.border = initial;

    if (oldporder != null && oldporder.quatation_id.quatationrequest_id.supplier_id.companyfullname != JSON.parse(cmbSupplier.value).name) {
        cmbSupplier.style.border = updated;
    } else {
        cmbSupplier.style.border = valid;
    }
    //oldcmb = JSON.parse(cmbSupplier.value).name;

    //when continue on the main form if someone try to change the supplier hen progress going on
    //the programm ask user to do you want to discard your previous work or continue on the same supplier
    if(porder.porderHasItemList.length != 0 ){
        selectedsupplier = JSON.parse(cmbSupplier.value);
        swal({
            title: "Table Has Some Values. Do You Want to Discard them ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                porder.porderHasItemList = [];
                fillInnerTable("tblInnerItem" , porder.porderHasItemList , innerModify , innerDelete, innerView);
            }else{
                fillCombo(cmbSupplier ,"" , activesuppliers ,"companyfullname" , selectedsupplier.companyfullname );
                cmbSupplier.style.border = "updated";
            }
        });
    }else{
        cmbInnerItem.style.border = "initial";
    }


}

function cmbQuatattionCH(){
    cmbInnerItem.disabled = false;
    refreshInnerForm();
    itemsbyquatationid = httpRequest("/item/listByQuatation?quatationid=" + JSON.parse(cmbQuatation.value).id , "GET");
    fillCombo(cmbInnerItem , "Select Item" , itemsbyquatationid , "itemname", "");
    //fillCombo(cmbInnerItem , "select Items" , items , 'itemname' , '' );


    if (oldporder != null && oldporder.quatation_id.quatationcode != JSON.parse(cmbQuatation.value).name) {
        cmbQuatation.style.border = updated;
    } else {
        cmbQuatation.style.border = valid;
    }


}

function cmbItemCH(){
    txtQty.disabled = false;
    txtQty.value = "";
    itemsByQuatationitemid = httpRequest("/quatation_has_item/listByQhi?quatationid="+JSON.parse(cmbQuatation.value).id+"&itemid="+JSON.parse(cmbInnerItem.value).id , "GET")

    txtPurchase.value = (itemsByQuatationitemid.purchaseprice).toFixed(2);
    txtPurchase.style.border = valid;
    pOrderHasItem.purchaseprice = txtPurchase.value;
}

//function for get line tot when user enter the item quantity
function btnLineTotMC(){
    txtLineTot.value = (parseFloat(txtPurchase.value) * parseFloat(txtQty.value)).toFixed(2);
    txtLineTot.style.border = valid;
    pOrderHasItem.linetotal = txtLineTot.value;
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
    porders = new Array();
    var data = httpRequest("/porder/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) porders = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblPorders', porders, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblPorders);

    if (activerowno != "") selectRow(tblPorders, activerowno, active);

}

//INNER FORM FUNCTIONS//////////////////////////////////////////////////////////////////////////////

//FILLING THE INNER FORM AND TABLE
function refreshInnerForm(){
    pOrderHasItem = new Object();
    oldpOrderHasItem = null;

    totalamount = 0;

    //setStyle(initial);
    cmbInnerItem.style.border=initial;
    txtPurchase.style.border = initial;
    txtQty.style.border = initial;
    txtLineTot.style.border = initial;

    txtPurchase.value = "";
    txtQty.value = "";
    txtLineTot.value = "";

    checkQtItems();

    //calculate total amount when adding items to to the inner form
    if(porder.porderHasItemList.length != 0){
        for(var index in porder.porderHasItemList){
            totalamount = (parseFloat(totalamount) + parseFloat(porder.porderHasItemList[index].linetotal)).toFixed(2);
        }

        txtTotItems.value = totalamount;
        porder.totalamount = txtTotItems.value;
        if(oldporder != null && porder.totalamount != oldporder.totalamount){
            txtTotItems.style.border = updated;
        }else{
            txtTotItems.style.border = valid;
        }
    }

    //INNER TABLE
    fillInnerTable("tblInnerItem" , porder.porderHasItemList , innerModify, innerDelete, innerView);

    btnInnerAdd.disabled = false;
    $('#btnInnerAdd').css('cursor' , 'pointer');
    $('#btnInnerUpdate').css('cursor' , 'not-allowed');
    btnInnerUpdate.disabled = true;

}

//this function use for call items according to the quotation from second adding
function checkQtItems() {
    if(cmbQuatation.value != ""){
        cmbInnerItem.disabled = false;
        itemsbyquatationid = httpRequest("/item/listByQuatation?quatationid=" + JSON.parse(cmbQuatation.value).id , "GET");
        fillCombo(cmbInnerItem , "Select Item" , itemsbyquatationid , "itemname", "");
    }
}

//when user adding items to the purchase order form system must check the credit limits and
//areus ammounts of the supplier.  if user adding items exceeding the credit limit system must show a error massege to the user
function chkcreditlimit(){
    var creditallowedornot = true;
    balancecredit = 0;
    var creditlimit = parseFloat(JSON.parse(cmbSupplier.value).creditlimit);
    var areasamount = parseFloat(JSON.parse(cmbSupplier.value).areasamount);
    if(areasamount == 0){
        allowedamount = creditlimit;
    }else{
        allowedamount = creditlimit - areasamount;
    }
    balancecredit = allowedamount;
    var currrenttotalamount = 0;
    if(porder.porderHasItemList.length == 0){
       currrenttotalamount = parseFloat(pOrderHasItem.linetotal);
        balancecredit = balancecredit - currrenttotalamount;
    }else{
        balancecredit = balancecredit - parseFloat(parseFloat(txtTotItems.value));
        currrenttotalamount =  parseFloat(pOrderHasItem.linetotal) + parseFloat(txtTotItems.value);
    }

    if(allowedamount >= currrenttotalamount ){
        creditallowedornot = true;
    }else{
        creditallowedornot = false;
    }

    return creditallowedornot;
}

//check if the employeer adding zero quantity to the invoice
function checkzero() {
    if (txtQty.value == "0") {
        swal({
            title: "Quantity cannot be zero !!!",
            text: "\n",
            icon: "error",
            time: 1200,
            button: false,
            dangerMode: true,
        });

        txtQty.value = "";
        txtLineTot.value = "";
        txtQty.style.border = initial;
        txtLineTot.style.border = initial;

        return true;
    }
}

function btnInnerAddMC(){
    var itmExist = false;

    if(txtPurchase.value == "" || txtQty.value == "" || txtLineTot.value == "" ){
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
    }else{
        for(var index in porder.porderHasItemList){
            if(porder.porderHasItemList[index].item_id.itemname == pOrderHasItem.item_id.itemname){
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
            //chkcreditlimit function eka call wela true pass unoth inner form ekata item eka add wenawa nattan swal call wenawa
            if(chkcreditlimit()){
                porder.porderHasItemList.push(pOrderHasItem);
                refreshInnerForm();
            }else{
                swal({
                    title: "Credit Limit Exceed !!!",
                    text: "\n Available Credit :" + toDecimal(balancecredit),
                    icon: "warning",
                    time:1200,
                    button:false,
                    dangerMode: true,
                });
            }


        }
    }

}

function innerModify(innerob , innerrow){
    pOrderHasItem = JSON.parse(JSON.stringify(innerob));
    oldpOrderHasItem = JSON.parse(JSON.stringify(innerob));
    inneractiverowno = innerrow;

    itemsbyquatationid = httpRequest("/item/listByQuatation?quatationid=" + JSON.parse(cmbQuatation.value).id , "GET");
    fillCombo(cmbInnerItem , "Select Item" , itemsbyquatationid , "itemname", pOrderHasItem.item_id.itemname);
    cmbInnerItem.disabled = true;
    txtQty.disabled = false;

    cmbInnerItem.style.border=valid;
    txtPurchase.style.border = valid;
    txtQty.style.border = valid;
    txtLineTot.style.border = valid;

    txtPurchase.value = pOrderHasItem.purchaseprice;
    txtQty.value = pOrderHasItem.qty;
    txtLineTot.value = pOrderHasItem.linetotal;

    btnInnerAdd.disabled = true;
    $('#btnInnerAdd').css('cursor' , 'not-allowed');
    btnInnerUpdate.disabled = false;
    $('#btnInnerUpdate').css('cursor' , 'pointer');

}

function btnInnerUpdateMC() {
    //chkcreditlimit function eka call wela true pass unoth inner form ekata item eka add wenawa nattan swal call wenawa
    if(chkcreditlimit()){
        porder.porderHasItemList[inneractiverowno]  = pOrderHasItem;
        refreshInnerForm();
    }else{
        swal({
            title: "Credit Limit Exceed !!!",
            text: "\n Available Credit :" + toDecimal(balancecredit),
            icon: "warning",
            time:1200,
            button:false,
            dangerMode: true,
        });
    }
}
function innerDelete(innerob , innerrow){
    swal({
        title: "Are You Sure to Delete Item??",
        text: "\n" +innerob.item_id.itemname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            porder.porderHasItemList.splice(innerrow, 1);
            refreshInnerForm();
        }

    });

}

function innerView(){
}

//INNER FORM FUNCTIONS//////////////////////////////////////////////////////////////////////////////

function paginate(page) {
    var paginate;
    if (oldporder == null) {
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
function viewitem(pod, rowno) {
    porder = JSON.parse(JSON.stringify(pod));

    tdPcode.innerHTML = porder.pordercode;
    tdRequireDate.innerHTML = porder.requireddate;
    tdSupplier.innerHTML = porder.quatation_id.quatationrequest_id.companyfullname;
    tdQuatation.innerHTML = porder.quatation_id.quatationcode;
    tdTotal.innerHTML = porder.totalamount;
    tdDescription.innerHTML = porder.description;
    tdAdded.innerHTML = porder.addeddate;
    tdPOrderStatus.innerHTML = porder.porderstatus_id.name;
    tdAddedBy.innerHTML = porder.employee_id.callingname;


    //fillInnerTable("tblPrintInnerItem" , porder.porderHasItemList , innerModify , innerDelete, innerView);

    $('#dataViewModel').modal('show')


    /*if (employee.photo == null)
        tdphoto.src = 'resourse/image/noimage.png';
    else
        tdphoto.src = atob(employee.photo);*/
}

function btnPrintRowMC() {
    var format = itemDetailPrintTable.outerHTML;
    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'>" +
        "<body><div style='margin-top: 150px'><h1>supplier Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>itemDetailPrintTable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

//set styles to the form

function setStyle(style) {

    dterequired.style.border = style;
    txtTotItems.style.border = style;

    cmbSupplier.style.border = style;
    cmbQuatation.style.border = style;
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
    for (index in porders) {
        if (porders[index].porderstatus_id.name == "delete") {
            tblPorders.children[1].children[index].style.color = "#f00";
            tblPorders.children[1].children[index].style.border = "2px solid red";
            tblPorders.children[1].children[index].lastChild.children[1].disabled = true;
            tblPorders.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (porder.pordercode == null)
        errors = errors + "\n" + "Please Enter Valid Purchase Code";
    else addvalue = 1;

    if (porder.requireddate == null)
        errors = errors + "\n" + "Please Enter Valid Date";
    else addvalue = 1;

    if (porder.quatation_id.quatationrequest_id.supplier_id == null)
        errors = errors + "\n" + "Please Select a Supplier";
    else addvalue = 1;

    if (porder.quatation_id == null)
        errors = errors + "\n" + " Select a Quatation";
    else addvalue = 1;

    if(porder.porderHasItemList.length == 0){
        cmbInnerItem.style.border = invalid;
        errors = errors + "\n" + "Please select at leat 01 Item";
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
        title: "Are you sure to add following Purchase Order...?",
        text: "\nPurchase Order Code : " + porder.pordercode +
            "\nRequired Date : " + porder.requireddate +
            "\nTotal Amount : " + porder.totalamount +
            "\nAdded Date : " + porder.addeddate +
            "\nStatus: " + porder.porderstatus_id.name,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/porder", "POST", porder);
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
                $('#maintable').modal('hide');
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

    if (oldporder == null && addvalue == "") {
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
function fillForm(pod, rowno) {
    activepage = rowno;

    if (oldporder == null) {
        filldata(pod);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(pod);
            }
        });
    }
}

//fill data to the form
function filldata(pod) {
    clearSelection(tblPorders);
    selectRow(tblPorders, activepage, active);

    porder = JSON.parse(JSON.stringify(pod));
    oldporder = JSON.parse(JSON.stringify(pod));

    //cannot change
    txtPCode.value = porder.pordercode;
    txtPCode.disabled = "disabled";

    //cannot change
    dteDate.value = porder.addeddate;
    dteDate.disabled = "disabled" ;

    dterequired.value = porder.requireddate;

    //cannot change
    fillCombo(cmbEmployee, "" , employees , "callingname" , porder.employee_id.callingname);
    cmbEmployee.disabled = "disabled";

    //cannot change
    fillCombo(cmbStatus , "" , porderstatuses , "name" , porder.porderstatus_id.name);
    cmbStatus.disabled = false;

    txtDescription.value = porder.description;

    txtTotItems.value = porder.totalamount;
    txtTotItems.disabled = true;

    //cannot change
    fillCombo(cmbSupplier , "" , activesuppliers , "companyfullname" , porder.quatation_id.quatationrequest_id.supplier_id.companyfullname);
    cmbSupplier.disabled = true;

    //cannot change
    fillCombo(cmbQuatation , "" , quatations , "quatationcode" , porder.quatation_id.quatationcode);
    cmbQuatation.disabled = true;

    disableButtons(true, false, false);
    setStyle(valid);
    //changeTab('form');

    //OPTIONAL FIELDS
    if(porder.description == null)
        txtDescription.style.border= initial;

    // refresh inner
    refreshInnerForm();

    /*cmbQuatattionCH();
    cmbItemCH();
    btnLineTotMC();*/
    $('#maintable').modal('show');

}


function getUpdates() {

    var updates = "";

    if (porder != null && oldporder != null) {

        if (porder.requireddate != oldporder.requireddate)
            updates = updates + "\nRequired date is Changed";

        if (porder.description != oldporder.description)
            updates = updates + "\nDescription is Changed";

        if(porder.porderstatus_id.name != oldporder.porderstatus_id.name)
            updates = updates + "\nStatis is changed"

        if(isEqual(porder.porderHasItemList , oldporder.porderHasItemList , "item_id"))
            updates = updates + "\nPurchase Order Item is Changed";
    }
    return updates;
}

//update button
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
                title: "Are you sure to update following Purchase Order details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/porder", "PUT", porder);
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
                            //changeTab('table');

                        } else swal({
                            title:'You have following errors in your form', icon: "error",
                            text : (response),
                            button:false,
                            timer:1200
                        })
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

function btnDeleteMC(pod) {
    porder = JSON.parse(JSON.stringify(pod));

    swal({
        title: "Are you sure to delete following Purchase Order...?",
        text: "\nPurchase Code : " + porder.pordercode +
            "\n Require Date : " + porder.requireddate +
            "\n Total Amount : " + porder.totalamount+
            "\n Quatation : " + porder.quatation_id.quatationcode+
            "\n Supplier : " + porder.quatation_id.quatationrequest_id.supplier_id.companyfullname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/porder", "DELETE", porder);
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
    formattab = tblPorders.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Purchase Order Details : </h1></div>" +
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

    var cprop = tblPorders.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        porders.sort(
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
        porders.sort(
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
    fillTable('tblPorders', porders, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblPorders);
    loadForm();

    if (activerowno != "") selectRow(tblPorders, activerowno, active);


}