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

    $('.collapse').collapse('hide');

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    //btnUpdate.addEventListener("click", btnUpdateMC);

    //dteDOBirth.onchange = dteDOBirthCH;
    txtSearchName.addEventListener("keyup", btnSearchMC);

    txtBatch.addEventListener("keyup", batchFind);

    privilages = httpRequest("../privilage?module=GRN", "GET");
    employees = httpRequest("../employee/list", "GET");

    grns = httpRequest("../grn/list", "GET");
    supplierstatuses = httpRequest("supplierstatus/list", "GET");
    activesuppliers = httpRequest("../supplier/ActiveSup", "GET");
    items = httpRequest("../item/list", "GET");
    grnstatuses = httpRequest("../grnstatus/list", "GET");
    grntypes = httpRequest("../grntype/list", "GET");
    porders = httpRequest("../porder/list", "GET");
    supreturns = httpRequest("../supreturn/list", "GET");

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
    grn = new Object();
    oldgrn = null;

    //create a new array (INNER FORM)
    grn.grnHasBatchList = new Array();

    fillCombo(cmbStatus, "", grnstatuses, "name", "Active");
    fillCombo(cmbAddedBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    grn.grnstatus_id = JSON.parse(cmbStatus.value);
    cmbStatus.disabled = true;

    grn.employee_id = JSON.parse(cmbAddedBy.value);
    cmbAddedBy.disabled = true;

    fillCombo(cmbgrnType, "Select GRN Type", grntypes, "name", "");
    fillCombo(cmbSupplier, "Select Supplier", activesuppliers, "companyfullname", "");
    fillCombo(cmbPorder, "Select Purchase Order", '', "pordercode", "");
    fillCombo(cmbSupReturn, "Select Sup Return", '', "supreturncode", "");

    /*received date*/ /*aapu grn ekk daws 7k yanakn insert krnna puluwan*/
    let minDate = new Date();
    minDate.setDate(minDate.getDate() - 7);
    dteReceived.min = minDate.getFullYear() + "-" + getmonthdate(minDate);

    dteReceived.max = getCurrentTimeDate("date");


    dteAddedDate.value = getCurrentTimeDate("date");
    grn.addeddate = dteAddedDate.value;
    dteAddedDate.disabled = true;

    //Get Next Number Form Data Base
    var nextNumber = httpRequest("/grn/nextnumber", "GET");
    grnCode.value = nextNumber.grncode;
    grn.grncode = grnCode.value;
    grnCode.disabled = "disabled";

    cmbgrnType.disabled = true;
    cmbPorder.disabled = true;
    cmbSupReturn.disabled = true;

    cmbgrnType.value = "";
    cmbSupplier.value = "";
    cmbPorder.value = "";
    cmbSupReturn.value = "";
    txtTotalAmount.value = "";
    txtNetAmount.value = "";
    txtGrossAmount.value = "";
    txtDescription.value = "";
    txtDiscountRatio.value = "";
    txtReturnAmount.value = "";

    // removeFile('flePhoto');

    setStyle(initial);
    grnCode.style.border = valid;
    dteAddedDate.style.border = valid;
    cmbAddedBy.style.border = valid;
    cmbStatus.style.border = valid;
    disableButtons(false, true, true);

    refreshInnerForm();
}

function totQuantity() {
    txtTotalQty.value = (parseFloat(txtQuantity.value) + parseFloat(txtFreeQuantity.value)).toFixed(0);
    txtTotalQty.style.border = valid;
    grnHasBatch.totalqty = txtTotalQty.value;

}

function checkzero() {
    txtFreeQuantity.disabled = false;
    if (txtQuantity.value == "0") {
        swal({
            title: "Quantity cannot be zero !!!",
            text: "\n",
            icon: "error",
            time: 1200,
            button: false,
            dangerMode: true,
        });

        txtQuantity.value = "";
        txtTotalQty.value = "";
        txtQuantity.style.border = invalid;
        txtTotalQty.style.border = invalid;
    }

}

function lineTot() {
    txtLineTotal.value = (parseFloat(txtPurchase.value) * (parseFloat(txtQuantity.value))).toFixed(2);
    txtLineTotal.style.border = valid;
    grnHasBatch.linetotal = txtLineTotal.value;
}

//INNER FORM FUNCTIONS//////////////////////////////////////////////////////////////////////////////

//FILLING THE INNER FORM AND TABLE
function refreshInnerForm() {
    grnHasBatch = new Object();
    oldgrnHasBatch = null;

    batch = new Object();
    oldbatch = null;

    //INNER FORM
    //AUTO FILL DATA

    /*manufacture date*/
    //min - no limit
    //max - day before date
    let maxManu = new Date();
    maxManu.setDate(maxManu.getDate() - 1);
    dteManDate.max = maxManu.getFullYear() + "-" + getmonthdate(maxManu);

    /*expire date*/
    //min - after 3 days
    let minExpire = new Date();
    minExpire.setDate(minExpire.getDate() + 3);
    dteExpDate.min = minExpire.getFullYear() + "-" + getmonthdate(minExpire);

    txtDiscount.value = 0;
    batch.discountratio = txtDiscount.value;
    txtDiscount.style.border = valid;

    txtFreeQuantity.value = 0;
    grnHasBatch.freeqty = txtFreeQuantity.value;
    txtFreeQuantity.style.border = valid;

    txtReturnAmount.value = 0;
    grn.returnamount = txtReturnAmount.value;
    txtReturnAmount.style.border = valid;

    txtLineTotal.disabled = true;
    txtGrossAmount.disabled = true;
    txtNetAmount.disabled = true;
    txtTotalAmount.disabled = true;
    txtReturnAmount.disabled = true;
    txtBatch.disabled = true;
    txtSalesPrice.disabled = true;

    //setStyle(initial);
    cmbItem.value = "";
    txtBatch.value = "";
    txtPurchase.value = "";
    txtSalesPrice.value = "";
    txtQuantity.value = "";
    txtTotalQty.value = "";
    txtLineTotal.value = "";

    $("#selectCmbItemsParent .select2-container").css('border', initial);
    txtBatch.style.border = initial;
    txtPurchase.style.border = initial;
    txtSalesPrice.style.border = initial;
    txtQuantity.style.border = initial;
    txtTotalQty.style.border = initial;
    txtLineTotal.style.border = initial;
    dteManDate.style.border = initial;
    dteExpDate.style.border = initial;

    /*if (JSON.parse(cmbPorder.value).id != null) {
        porderCH();
        /!*this function called because when refresh the inner form all items relted to
            purchase order are gone*!/
    } else {
        fillCombo(cmbItem, "Select Item", "", "", "");
    }*/


    //INNER TABLE
    fillInnerTable("tblInnerItem", grn.grnHasBatchList, innerModify, innerDelete, innerView);
    if (grn.grnHasBatchList.length != 0) {
        for (var index in grn.grnHasBatchList) {
            tblInnerItem.children[1].children[index].lastChild.children[0].style.display = "none";
        }
    }

    totalamount = 0;

    //calculate total amount when adding items to to the inner form
    if (grn.grnHasBatchList.length != 0) {
        for (var index in grn.grnHasBatchList) {
            totalamount = (parseFloat(totalamount) + parseFloat(grn.grnHasBatchList[index].linetotal)).toFixed(2);
        }

        txtTotalAmount.value = totalamount;
        grn.totalamount = txtTotalAmount.value;
        calculateNetAmount();
        if (oldgrn != null && grn.totalamount != oldgrn.totalamount) {
            txtTotalAmount.style.border = updated;
        } else {
            txtTotalAmount.style.border = valid;
        }
    }

    btnInnerAdd.disabled = false;
    $('#btnInnerAdd').css('cursor', 'pointer');
}

function porderCH() {
    if (JSON.parse(cmbgrnType.value).id == 2 || JSON.parse(cmbgrnType.value).id == 3) {
        itemsbyporders = httpRequest("item/listByPorder?porderid=" + JSON.parse(cmbPorder.value).id, "GET");
        fillCombo(cmbItem, "Select Items", itemsbyporders, "itemname", "");
    }
}

function batchFind() {

    txtSalesPrice.disabled = false;

    batchbyitemandbatch = httpRequest("/batch/batchlistbybatch?itemid=" + JSON.parse(cmbItem.value).id + "&batchcode=" + txtBatch.value, "GET");

    //me object eke ena eka not equal to empty kiyanne ehema ekak thiyenwa kiyana eka
    if (batchbyitemandbatch != "") {

        txtSalesPrice.value = batchbyitemandbatch.saleprice;
        txtPurchase.value = batchbyitemandbatch.purchaseprice;
        dteManDate.value = batchbyitemandbatch.manufacdate;
        dteExpDate.value = batchbyitemandbatch.expiredate;

        batch.batchnumber = txtBatch.value;
        batch.saleprice = txtSalesPrice.value;
        batch.purchaseprice = txtPurchase.value;
        batch.manufacdate = dteManDate.value;
        batch.expiredate = dteExpDate.value;

        txtBatch.style.border = valid;
        txtSalesPrice.style.border = valid;
        txtPurchase.style.border = valid;
        dteManDate.style.border = valid;
        dteExpDate.style.border = valid;

    } else {
        txtSalesPrice.value = 0;
        txtSalesPrice.style.border = initial;
    }
}

function itemCH() {
    txtBatch.disabled = false;

    if (JSON.parse(cmbgrnType.value).id == 2 || JSON.parse(cmbgrnType.value).id == 3) {
        poder = httpRequest("porder_has_item/listByItemPorder?itemid=" + JSON.parse(cmbItem.value).id + "&porder=" + JSON.parse(cmbPorder.value).id, "GET")
        txtPurchase.value = parseFloat(poder.purchaseprice).toFixed(2);
        batch.purchaseprice = txtPurchase.value;
        txtPurchase.style.border = valid;
        txtQuantity.value = poder.qty;
        grnHasBatch.qty = txtQuantity.value;
        txtQuantity.style.border = valid;
        lineTot();
        totQuantity();
    }

}

//when select the return only option all money related talsk will cancell out beacause return only means
//exchange only items not money
function grnTypeCH() {

    let grnTypeID = JSON.parse(cmbgrnType.value).id;

    //ID = 1 - RETURN ONLY - DISABLE PORDER
    //ID = 2 - PORDER - DISABLE RETURN
    //ID = 3 - PORDER WITH RETURN AMOUNT
    //ID = 4 - PORDER WITH RETURN ITEM

    if (grnTypeID == "1") { //return only

        cmbPorder.disabled = true;
        cmbSupReturn.disabled = false;

        txtTotalAmount.disabled = true;
        txtNetAmount.disabled = true;
        txtGrossAmount.disabled = true;
        txtDiscountRatio.disabled = true;
        txtReturnAmount.disabled = true;
    } else if (grnTypeID == "2") { //porder

        cmbPorder.disabled = false;
        cmbSupReturn.disabled = true;

        txtTotalAmount.disabled = false;
        txtNetAmount.disabled = false;
        txtGrossAmount.disabled = false;
        txtDiscountRatio.disabled = false;
        txtReturnAmount.disabled = false;
    } else {

        cmbPorder.disabled = false;
        cmbSupReturn.disabled = false;

        txtTotalAmount.disabled = false;
        txtNetAmount.disabled = false;
        txtGrossAmount.disabled = false;
        txtDiscountRatio.disabled = false;
        txtReturnAmount.disabled = false;
    }
}

function calculategross() {

}

function calculateNetAmount() {
    if (txtDiscountRatio.value == 0) {
        txtNetAmount.value = "";
        txtGrossAmount.value = "";
        txtGrossAmount.style.border = initial;
        txtNetAmount.style.border = initial;
    } else {
        if (txtDiscountRatio.value < 0 || txtDiscountRatio.value > 100) {
            swal({
                title: "Invalid Discount Ratio !!!",
                text: "\n",
                icon: "error",
                time: 1200,
                button: false,
                dangerMode: true,
            });

            txtDiscountRatio.style.border = invalid;
            txtDiscountRatio.value = "";

        } else {
            netamount = (parseFloat(totalamount) - (parseFloat(totalamount) * (JSON.parse(txtDiscountRatio.value) / 100))).toFixed(2);
            txtNetAmount.value = netamount;
            grn.netamount = txtNetAmount.value;

            grossamount = (parseFloat(netamount) - JSON.parse(txtReturnAmount.value)).toFixed(2);
            txtGrossAmount.value = grossamount;
            grn.grossamount = txtGrossAmount.value;

            if (oldgrn != null && grn.grossamount != oldgrn.grossamount) {
                txtGrossAmount.style.border = updated;
            } else {
                txtGrossAmount.style.border = valid;
            }


            if (oldgrn != null && grn.netamount != oldgrn.netamount) {
                txtNetAmount.style.border = updated;
            } else {
                txtNetAmount.style.border = valid;
            }
        }
    }

}

function cmbSupplierFilters() {

    //when continue on the main form if someone try to change the supplier hen progress going on
    //the programm ask user to do you want to discard your previous work or continue on the same supplier
    /*if(grn.grnHasBatchList.length != 0 ){
        swal({
            title: "Table Has Some Values. Do You Want to Discard them ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                txtTotalAmount.value = "";
                txtNetAmount.value = "";
                txtGrossAmount.value = "";
                txtDiscountRatio.value = "";

                txtTotalAmount.style.border = initial;
                txtNetAmount.style.border = initial;
                txtGrossAmount.style.border = initial;
                txtDiscountRatio.style.border = initial;

                grn.grnHasBatchList = [];
                fillInnerTable("tblInnerItem" , grn.grnHasBatchList , innerModify , innerDelete, innerView);
            }else{
                swal({
                    title: "This code must reprogramme ?",
                    text: "\n",
                    icon: "warning", buttons: false, dangerMode: true,
                })
            }
        });
    }*/

    cmbgrnType.disabled = false;

    refreshInnerForm();

    //filter purchase orders according to the selected supplier
    pordersbysupplier = httpRequest("/porder/podBySupplier?supplierid=" + JSON.parse(cmbSupplier.value).id, "GET");
    fillCombo(cmbPorder, 'Select Purchase Order', pordersbysupplier, "pordercode", "");

    //filter suplier return codes acording to the supplier
    supreturnbysupplier = httpRequest("supreturn/supRetBySupplier?supplierid=" + JSON.parse(cmbSupplier.value).id, "GET");
    fillCombo(cmbSupReturn, "Select Sup Return", supreturnbysupplier, "supreturncode", "");

}

//when select a supplier return option auto fill the amount of supplier return
/*when supplier return and porder both selected filter out items according to the porder and supplier returm*/
function fillSupReturntxt() {

    if (JSON.parse(cmbgrnType.value).id == 3) {
        txtReturnAmount.value = JSON.parse(cmbSupReturn.value).totalamount;
        txtReturnAmount.style.border = valid;
        grn.returnamount = txtReturnAmount.value;
    }

    if (JSON.parse(cmbgrnType.value).id == 4) {

        if (cmbPorder.value != null && cmbSupReturn.value != null) {
            itemsbyporderandsupplierreturn = httpRequest("/item/listbyporderandsupplierreturn?porderid=" + JSON.parse(cmbPorder.value).id + "&returnid=" + JSON.parse(cmbSupReturn.value).id, "GET");
            fillCombo3(cmbItem, "Select Item", itemsbyporderandsupplierreturn, "itemname", 'itemcode', '');
            cmbItem.disabled = false;
            txtReturnAmount.value = 0;
        }

    }
}

//inner form adding
function btnInnerAddMC() {

    //grn eke batch eke tyena data item tyena nisa batch object ekk genalla grnhas batch eke batch id ekata
    //set krla tyenne
    grnHasBatch.batch_id = batch;

    var itmExist = false;

    if (txtBatch.value == "" || txtPurchase.value == "" || txtSalesPrice.value == "" || txtQuantity.value == "" || txtFreeQuantity.value == "" ||
        txtTotalQty.value == "" ||
        txtLineTotal.value == "" ||
        dteManDate.value == "" ||
        dteExpDate.value == "") {
        swal({
            title: "Some Fields Have Empty !!!",
            text: "\n",
            icon: "warning",
            time: 1200,
            button: false,
            dangerMode: true,
        });
    } else {
        for (var index in grn.grnHasBatchList) {
            if (grn.grnHasBatchList[index].batch_id.item_id.itemname == grnHasBatch.batch_id.item_id.itemname) {
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
            grn.grnHasBatchList.push(grnHasBatch);
            refreshInnerForm();
        }

    }

}

function btnInnerUpdateMC() {


}

//Modify Inner table of grn form
function innerModify(innerob, innerrow) {

    /*grnHasBatch = JSON.parse(JSON.stringify(innerob));
    oldgrnHasBatch = JSON.parse(JSON.stringify(innerob));
    inneractiverowno = innerrow;

    itemsbysupplierid = httpRequest("/porder/podBySupplier?supplierid=" + JSON.parse(cmbSupplier.value).id , "GET");
    fillCombo(cmbInnerItem , "Select Item" , itemsbysupplierid , "itemname", pOrderHasItem.item_id.itemname);
    cmbInnerItem.disabled = true;
    txtQty.disabled = false;

    cmbInnerItem.style.border=valid;
    txtPurchase.style.border = valid;
    txtQty.style.border = valid;
    txtLineTot.style.border = valid;

    txtPurchase.value = pOrderHasItem.purchaseprice;
    txtQty.value = pOrderHasItem.qty;
    txtLineTot.value = pOrderHasItem.linetotal;*/

}

function innerDelete(innerob, innerrow) {
    swal({
        title: "Are You Sure to Delete Item??",
        //text: "\n"  + innerob.item_id.itemname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            grn.grnHasBatchList.splice(innerrow, 1);
            refreshInnerForm();
        }

    });

}

function innerView() {

}

function innerModify(innerob, innerrow) {

    /* grnHasBatch = JSON.parse(JSON.stringify(innerob));
     oldgrnHasBatch = JSON.parse(JSON.stringify(innerob));

     inneractiverowno = innerrow;

     itemsbyporder = httpRequest("/item/listByPorder?porderid=" + JSON.parse(cmbPorder.value).id , "GET");
     fillCombo(cmbItem , "Select Items" , itemsbyporder , "itemname" , grnHasBatch.batch_id.item_id.itemname);
     cmbItem.disabled = true;

     cmbItem.style.border=valid;
     txtBatch.style.border = valid;
     txtPurchase .style.border = valid;
     txtSalesPrice.style.border = valid;
     txtQuantity.style.border = valid;
     txtFreeQuantity.style.border = valid;

     txtTotalQty.style.border = valid;
     txtTotalQty.disabled = true;

     txtDiscount.style.border = valid;
     txtDiscount.disabled = true;

     txtLineTotal.style.border = valid;
     txtLineTotal.disabled = true;

     dteManDate.style.border = valid;
     dteExpDate.style.border = valid;

     txtBatch.value = grnHasBatchbatch.batch_id.batchnumber;
     txtPurchase.value = grnHasBatchbatch.batch_id.purchaseprice;
     txtSalesPrice.value = grnHasBatchbatch.batch_id.saleprice;
     txtDiscount.value = grnHasBatchbatch.batch_id.discountratio;

     txtQuantity.value = grnHasBatch.qty;
     txtFreeQuantity.value = grnHasBatch.freeqty;
     txtTotalQty.value = grnHasBatch.totalqty;
     txtLineTotal.value = grnHasBatch.linetotal;

     dteManDate.value = grnHasBatchbatch.batch_id.manufacdate;
     dteExpDate.value = grnHasBatchbatch.batch_id.expiredate;

     btnInnerAdd.disabled = true;
     $('#btnInnerAdd').css('cursor' , 'not-allowed');
     btnInnerUpdate.disabled = false;
     $('#btnInnerUpdate').css('cursor' , 'pointer');*/

}

//INNER FORM FUNCTIONS//////////////////////////////////////////////////////////////////////////////

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
    grns = new Array();
    var data = httpRequest("/grn/findAll?page=" + page + "&size=" + size + query, "GET");
    //var data = httpRequest("/grn/findAll?page=" + page + "&size=" + size , "GET");
    console.log("/grn/findAll?page=" + page + "&size=" + size + query)
    if (data.content != undefined) grns = data.content;
    console.log(grns);
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblGRN', grns, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblGRN);

    if (activerowno != "") selectRow(tblGRN, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldgrn == null) {
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
function viewitem(grn, rowno) {

    grnview = JSON.parse(JSON.stringify(grn));

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    tdPrinted.innerHTML = date + ' ' + time;

    tdGrnNo.innerHTML = grnview.grncode;
    tdGrnType.innerHTML = grnview.grntype_id.name;
    tdSupplier.innerHTML = grnview.supplier_id.companyfullname;

    if (grnview.porder_id.pordercode == null) {
        tdPorder.innerHTML = "-";
    } else {
        tdPorder.innerHTML = grnview.porder_id.pordercode;
    }

    tdSupReturn.innerHTML = grnview.supplierreturn_id.supreturncode;
    tdReceivedDate.innerHTML = grnview.receiveddate;
    tdItemTot.innerHTML = grnview.totalamount;

    if (grnview.returnamount == null) {
        tdReturn.innerHTML = "-";
    } else {
        tdReturn.innerHTML = grnview.returnamount;
    }

    tdDiscount.innerHTML = grnview.discountedratio;
    tdNetAmount.innerHTML = grnview.netamount;
    tdGross.innerHTML = grnview.grossamount;

    if (grnview.description == null) {
        tdDescription.innerHTML = "-";
    } else {
        tdDescription.innerHTML = grnview.description;
    }

    tdAddedBy.innerHTML = grnview.employee_id.callingname;
    tdStatus.innerHTML = grnview.grnstatus_id.name;
    tdAdded.innerHTML = grnview.addeddate;

    fillInnerTable("printInnerTable", grnview.grnHasBatchList, innerModify, innerDelete, innerView);

    $('#grnDataViewModal').modal('show')

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
        "<div style='font-weight: bold ; text-align: right ; font-size: xx-large'>OMEL LANKA Super Market</div>" +
        "</div>" +
        "<div class='col-md-4'>" +
        "<img src='resources/image/favicon.png' width='50px' height='50px' style='text-align: center'>" +
        "</div>" +
        "</div>" +
        "<div class='row'>" +
        "<div class='col-md-12 ml-3 mt-2'><span style='text-align: left ; font-size: x-large ; font-weight: bold'>GRN Details</span></div>" +
        "</div>" +
        "</div>" +
        "</div>" +
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

    grnCode.style.border = style;
    cmbgrnType.style.border = style;
    cmbSupplier.style.border = style;
    cmbPorder.style.border = style;
    cmbSupReturn.style.border = style;
    dteReceived.style.border = style;
    txtTotalAmount.style.border = style;
    txtNetAmount.style.border = style;
    txtGrossAmount.style.border = style;
    txtDescription.style.border = style;
    txtDiscountRatio.style.border = style;
    txtReturnAmount.style.border = style;

}

function disableButtons(add, upd, del) {

    if (add || !privilages.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer')
    }

    /*if (upd || !privilages.update) {
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
    }*/

    if (!privilages.delete) {
        $(".buttondel").prop('disabled', true);
        $(".buttondel").css('cursor', 'not-allowed');
    } else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor', 'pointer');
    }

    // select deleted data row
    for (index in grns) {
        tblGRN.children[1].children[index].lastChild.children[0].style.display = "none";
        tblGRN.children[1].children[index].lastChild.children[1].style.display = "none";

        if (grns[index].grnstatus_id.name == "Deleted") {
            tblGRN.children[1].children[index].style.color = "#f00";
            tblGRN.children[1].children[index].style.border = "2px solid red";
            //  tblGRN.children[1].children[index].lastChild.children[1].disabled = true;
            //  tblGRN.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (grn.grntype_id == null)
        errors = errors + "\n" + "Please Select the GRN Type";
    else addvalue = 1;

    if (grn.supplier_id == null)
        errors = errors + "\n" + "Please Select the Supplier";
    else addvalue = 1;

    if (grn.porder_id == null && grn.supplierreturn_id == null)
        errors = errors + "\n" + "Please Select Purchase Order or Supplier Return";
    else addvalue = 1;

    if (grn.receiveddate == null)
        errors = errors + "\n" + "Please Select the Item Received Date";
    else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtDescription.value == "") {
            swal({
                title: "Are You Sure to Continue...?",
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
            title: "You Have Following Errors",
            text: "\n" + getErrors(),
            icon: "error",
            button: true,
        });

    }
}

function savedata() {

    swal({
        title: "Are You Sure to add The GRN ? ",
        text: "\nGRN Code : " + grn.grncode +
            "\nGRN Type : " + grn.grntype_id.name +
            "\nSupplier : " + grn.supplier_id.companyfullname +
            "\nPurchase Order : " + grn.porder_id.pordercode +
            "\nReceived Date : " + grn.receiveddate +
            "\nAdded Date : " + grn.addeddate +
            "\nGRN Status : " + grn.grnstatus_id.name,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/grn", "POST", grn);
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
                loadView();
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

    if (oldgrn == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values Do you want to discrd all values. All data will delete including added items?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                loadForm();
                refreshInnerForm();
                grn.grnHasBatchList = [];
                fillInnerTable("tblInnerItem", grn.grnHasBatchList, innerModify, innerDelete, innerView);
            }

        });
    }

}


//when clicking update button in table view
function fillForm(gr, rowno) {
}


function btnDeleteMC(grn) {
    grn = JSON.parse(JSON.stringify(grn));

    swal({
        title: "Are you sure to delete following GRN...?",
        text: "\nGRN Code : " + grn.grncode +
            "\n GRN Type : " + grn.grntype_id.name +
            "\n Supplier : " + grn.supplier_id.companyfullname +
            "\n Purchase Order : " + grn.porder_id.pordercode +
            "\n Status : " + grn.grnstatus_id.name,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/grn", "DELETE", grn);
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

function btnPrintTableMC(grn) {

    var newwindow = window.open();
    formattab = tblGRN.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body>" +
        "<script>" +
        "var today = new Date();\n" +
        "    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();\n" +
        "    var time = today.getHours() + \":\" + today.getMinutes() + \":\" + today.getSeconds();" +
        "tdPrinted.innerHTML = date+' '+time;" +
        "</script>" +
        "<div class='float-right'>" +
        "<label>Report Printed On - :</label> <span id='tdPrinted'></span>" +
        "</div> " +
        "<div style='margin-top: 75px'>" +
        "<div class='row'>" +
        "<div class='col-md-8'>" +
        "<div style='font-weight: bold ; text-align: right ; font-size: xx-large'>OMEL LANKA Super Market</div>" +
        "</div>" +
        "<div class='col-md-4'>" +
        "<img src='resources/image/favicon.png' width='50px' height='50px' style='text-align: center'>" +
        "</div>" +
        "</div>" +
        "<div class='row' style='margin-bottom: 10px'>" +
        "<div class='col-md-12 ml-3 mt-2'><span style='text-align: left ; font-size: x-large ; font-weight: bold'>GRN Details</span></div>" +
        "</div>" +
        "</div>" +
        "</div>" +
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