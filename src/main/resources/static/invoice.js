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

    txtSearchName.addEventListener("keyup", btnSearchMC);

    invoices = httpRequest("../invoice/list" , "GET");

    privilages = httpRequest("../privilage?module=INVOICE", "GET");
    employees = httpRequest("../employee/list", "GET");

    activecustomers = httpRequest("../customer/ActiveCus", "GET");
    paymenthmethods = httpRequest("../invoicepaymentmethod/list", "GET");
    invoicestatuses = httpRequest("../invoicestatus/list", "GET");
    batches = httpRequest("../batch/list" , "GET");

    /*royaltypoints = httpRequest("../royaltypoint/list" , "GET");*/

    items = httpRequest("../item/list", "GET");

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
    invoice = new Object();
    oldinvoice = null;

    //create a new array (INNER FORM)
    invoice.invoiceHasItemList = new Array();

    dteAddedDate.value = nowDate("date");
    invoice.invoicedatetime = dteAddedDate.value;
    dteAddedDate.disabled = true;

    console.log(getCurrentTimeDate("date"));

    fillCombo(cmbAddedBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    invoice.employee_id = JSON.parse(cmbAddedBy.value);
    cmbAddedBy.disabled = true;

    fillCombo(cmbStatus, "", invoicestatuses, 'name', "");
    invoice.invoicestatus_id = JSON.parse(cmbStatus.value);
    cmbStatus.disabled = true;

    fillCombo4(cmbCustomer, "Select Customer", activecustomers, "fname", "lname", "mobileno", "");

    fillCombo(cmbPaymentMeth, "Select Payment Method", paymenthmethods, "name", "cash");
    cmbPaymentMeth.style.border = valid;

    fillCombo(cmbCustomerOrder , "Select Customer Order" , "" , '' , '');

    //binding for the payment method
    invoice.invoicepaymentmethod_id = JSON.parse(cmbPaymentMeth.value);

     //Get Next Number Form Data Base
     var nextNumber = httpRequest("/invoice/nextnumber", "GET");
    txtInvoiceNo.value = nextNumber.invoiceno;
     invoice.invoiceno = txtInvoiceNo.value;
    txtInvoiceNo.disabled = "disabled";

    $('#rownewCusName').collapse('show');
    $('#rowCusMobile').collapse('show');

    txtTotamount.disabled = true;
    txtNetAmount.disabled = true;
    txtBalanceamount.disabled = true;
    txtDiscountrat.disabled = true;

    txtDiscountrat.value = 0;
    txtDiscountrat.style.border = valid;
    invoice.discountratio = txtDiscountrat.value;

    txtCustomerName.value = "";
    txtCustomerMobile.value = "";
    txtDescription.value = "";

    txtTotamount.value = "";
    txtPaid.value = "";
    txtNetAmount.value = "";
    txtBalanceamount.value = "";

    setStyle(initial);
    dteAddedDate.style.border = valid;
    cmbAddedBy.style.border = valid;
    cmbStatus.style.border = valid;
    txtInvoiceNo.style.border = valid;

    disableButtons(false, true, true);

    refreshInnerForm();
}

//INNER FORM FUNCTIONS//////////////////////////////////////////////////////////////////////////////

//FILLING THE INNER FORM AND TABLE
function refreshInnerForm() {
    invoiceHasItem = new Object();
    oldinvoiceHasItem = null;

    batch = new Object();
    oldbatch = null;

    fillCombo(cmbItem, 'Select Item', items, "itemname", "");
    fillCombo(cmbBatch, "", "", "", "");

    //INNER FORM
    //AUTO FILL DATA

    txtSalesPrice.value = "";
    txtQty.value = "";
    txtLineTotal.value = "";
    txtLastSalePrice .value = "";
    txtavailbleqty.innerHTML="";
    discountDisplay.innerHTML = "";


    txtSalesPrice.disabled = true;
    txtLastSalePrice.disabled = true;
    txtLineTotal.disabled = true;

    //setStyle(initial);

    $("#select2InnerItemParent .select2-container").css('border' , initial);
    $("#select2InnerBatchParent .select2-container").css('border' , initial);
    cmbItem.style.border = initial;
    cmbBatch.style.border = initial;
    txtSalesPrice.style.border = initial;
    txtQty.style.border = initial;
    txtLineTotal.style.border = initial;
    txtLastSalePrice.style.border = initial;

    btnInnerAdd.disabled = false;
    $('#btnInnerAdd').css('cursor' , 'pointer');
    $('#btnInnerUpdate').css('cursor' , 'not-allowed');
    btnInnerUpdate.disabled = true;

    //INNER TABLE
    fillInnerTable("tblInnerItem", invoice.invoiceHasItemList, innerModify, innerDelete, innerView);

    totalamount = 0;

    //calculate total amount when adding items to to the inner form
    if (invoice.invoiceHasItemList.length != 0) {
        for (var index in invoice.invoiceHasItemList) {
            totalamount = (parseFloat(totalamount) + parseFloat(invoice.invoiceHasItemList[index].linetotal)).toFixed(2);

        }

        txtTotamount.value = totalamount;
        invoice.totalamount = txtTotamount.value;
        calculateNetAmount();
        if (oldinvoice != null && invoice.totalamount != oldinvoice.totalamount) {
            txtTotamount.style.border = updated;
        } else {
            txtTotamount.style.border = valid;
        }
    }
}

function checkmaxqty(){
    if(txtQty.value >= JSON.parse(cmbItem.value).maxqty){
        swal({
            title: "Eligible to discount !!!",
            text: "\n",
            icon: "warning",
            time: 1200,
            button: false,
            dangerMode: true,
        });
    }
}

//Inner form clear
function btnInnerClearMC(){
    if (cmbItem.value == "" || cmbBatch.value == "" || txtSalesPrice.value == "" || txtQty.value == "" || txtLineTotal.value == "") {
        refreshInnerForm();
    } else {
        swal({
            title: "Form has some values/ updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                refreshInnerForm();
            }
        });
    }
}

//inner form adding
function btnInnerAddMC() {

    invoiceHasItem.batch_id = batch;

    var itmExist = false;

    if (txtSalesPrice.value == "" || txtQty.value == "" || txtLineTotal.value == "") {
        swal({
            title: "Some Fields Have Empty !!!",
            text: "\n",
            icon: "warning",
            time: 1200,
            button: false,
            dangerMode: true,
        });
    } else {
        for (var index in invoice.invoiceHasItemList) {
            if (invoice.invoiceHasItemList[index].batch_id.id == invoiceHasItem.batch_id.id) {
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
            invoice.invoiceHasItemList.push(invoiceHasItem);
            refreshInnerForm();
        }

    }

}

//innerupdate
function btnInnerUpdateMC() {
    invoice.invoiceHasItemList[inneractiverowno]  = invoiceHasItem;
    refreshInnerForm();
}

function innerModify(innerob , innerrow){
    invoiceHasItem = JSON.parse(JSON.stringify(innerob));
    oldinvoiceHasItem = JSON.parse(JSON.stringify(innerob));
    inneractiverowno = innerrow;

    fillCombo(cmbItem , "Select Item" , items , "itemname", invoiceHasItem.item_id.itemname);
    fillCombo(cmbBatch , 'Select Batch' , batches , 'batchnumber' , invoiceHasItem.batch_id.batchnumber)

    txtSalesPrice.value = invoiceHasItem.saleprice;
    txtSalesPrice.disabled = true;

    txtQty.value = invoiceHasItem.qty;
    txtLastSalePrice.value = invoiceHasItem.lastsaleprice;
    txtLineTotal.value = invoiceHasItem.linetotal;

    txtavailbleqty.innerHTML = parseFloat(invoiceHasItem.availableqty)
    discountDisplay.innerHTML = parseFloat((invoiceHasItem.discountratio));

    cmbItem.style.border = valid;
    cmbBatch.style.border = valid;
    txtSalesPrice.style.border = valid;
    txtQty.style.border = valid;
    txtLastSalePrice.style.border = valid;
    txtLineTotal.style.border = valid;

/*
    if (oldinvoiceHasItem != null && invoiceHasItem.item_id.itemname != oldinvoiceHasItem.item_id.itemname) {
        $("#select2InnerItemParent .select2-container").css('border' , updated);
    } else {
        $("#select2InnerItemParent .select2-container").css('border' , valid);
    }

    if (oldinvoiceHasItem != null && invoiceHasItem.batch_id.batchnumber != oldinvoiceHasItem.batch_id.batchnumber) {
        $("#select2InnerBatchParent .select2-container").css('border' , updated);
    } else {
        $("#select2InnerBatchParent .select2-container").css('border' , valid);
    }

    if (oldinvoiceHasItem != null && invoiceHasItem.qty != oldinvoiceHasItem.qty) {
        txtQty.style.border = "updated";
    } else {
        txtQty.style.border = "valid";
    }
*/


    btnInnerAdd.disabled = true;
    $('#btnInnerAdd').css('cursor' , 'not-allowed');
    btnInnerUpdate.disabled = false;
    $('#btnInnerUpdate').css('cursor' , 'pointer');

}

function innerDelete(innerob, innerrow) {
    swal({
        title: "Are You Sure to Delete Item??",
        //text: "\n"  + innerob.item_id.itemname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            invoice.invoiceHasItemList.splice(innerrow, 1);
            refreshInnerForm();
        }

    });

}

function innerView() {

}

//INNER FORM FUNCTIONS//////////////////////////////////////////////////////////////////////////////

function calculateNetAmount() {
    if (txtDiscountrat.value == 0) {
        txtNetAmount.value = txtTotamount.value;
        txtNetAmount.style.border = valid;
        invoice.netamount = txtNetAmount.value;
    } else {
        if (txtDiscountrat.value < 0 || txtDiscountrat.value > 100) {
            swal({
                title: "Invalid Discount Ratio !!!",
                text: "\n",
                icon: "error",
                time: 1200,
                button: false,
                dangerMode: true,
            });

            txtDiscountrat.style.border = invalid;
            txtDiscountrat.value = "";

        } else {
            var toggleid = JSON.parse(cmbPaymentMeth.value).id;
            if (toggleid == 1) {
                cmbPaymentMeth.style.border = valid;

                netamount = (parseFloat(totalamount) - (parseFloat(totalamount) * (JSON.parse(txtDiscountrat.value) / 100))).toFixed(2);
                txtNetAmount.value = netamount;
                invoice.netamount = txtNetAmount.value;

                txtPaid.value = "";

                if (oldinvoice != null && invoice.netamount != oldinvoice.netamount) {
                    txtNetAmount.style.border = updated;
                } else {
                    txtNetAmount.style.border = valid;
                }
            }else if(toggleid == 2){

                cmbPaymentMeth.style.border = valid;

                netamount = (parseFloat(totalamount) - (parseFloat(totalamount) * (JSON.parse(txtDiscountrat.value) / 100))).toFixed(2);
                txtNetAmount.value = netamount;
                invoice.netamount = txtNetAmount.value;

                txtPaid.value = netamount;
                invoice.paidamount = txtPaid.value;

                if (oldinvoice != null && invoice.netamount != oldinvoice.netamount) {
                    txtNetAmount.style.border = updated;
                } else {
                    txtNetAmount.style.border = valid;
                }

                if (oldinvoice != null && invoice.paidamount != oldinvoice.paidamount) {
                    txtPaid.style.border = updated;
                } else {
                    txtPaid.style.border = valid;
                }
            }
        }
    }
}

//calculate balance amount when customer paid for the item
function calculateBalance() {
    balance = 0;
    areasbalance = 0;
    if (txtPaid.value >= txtNetAmount.value) {
        balance = parseFloat(txtPaid.value) - parseFloat(txtNetAmount.value);
        txtBalanceamount.value = balance;
        invoice.balanceamount = txtBalanceamount.value;
        txtBalanceamount.style.border = valid;
    } else if(txtPaid.value < txtNetAmount.value) {
        areasbalance = parseFloat(txtNetAmount.value) - parseFloat(txtPaid.value);

        txtPaid.style.border = invalid;
        txtBalanceamount.style.border = invalid;
        invoice.balanceamount = null;
    }else{
        txtBalanceamount.style.border = invalid;
        invoice.balanceamount = null;
    }
}

function checktoggle() {
    var toggleid = JSON.parse(cmbPaymentMeth.value).id;
    if (toggleid == 1) {
        txtPaid.value  = "";
        txtPaid.style.border = "initial";

        txtBalanceamount.value = "";
        txtBalanceamount.style.border = initial;

    } else if (toggleid == 2) {
        if(txtPaid.value == ""){
            txtPaid.value = netamount;
            invoice.paidamount = txtPaid.value;

            txtBalanceamount.value = 0;
            txtBalanceamount.style.border = valid;
            txtPaid.style.border = valid;
        }
    }
}

//getting relevent batches for the selected item
function itemCH() {
    batches = httpRequest("batch/listbyItem?itemname=" + JSON.parse(cmbItem.value).itemname, "GET");
    fillCombo4Brac(cmbBatch, "Select Batch", batches, "batchnumber", "availableqty", "saleprice", "");

    cmbBatch.style.border = initial;
    txtSalesPrice.style.border = initial;
    txtQty.style.border = initial;
    txtLastSalePrice.style.border = initial;
    txtLineTotal.style.border = initial;


    txtSalesPrice.value = "";
    txtQty.value = "";
    txtLastSalePrice.value = "";
    txtLineTotal.value = "";

}

//getting data about the selected batch number
function batchCH() {
    batch = httpRequest("batch/listbyBatch?batchno=" + JSON.parse(cmbBatch.value).batchnumber, "GET");

    txtSalesPrice.value = parseFloat(batch.saleprice).toFixed(2);
    invoiceHasItem.saleprice = txtSalesPrice.value;

    txtavailbleqty.innerHTML = parseFloat(batch.availableqty);


    if (true) {
        console.log(invoiceHasItem);

        txtLastSalePrice.value = parseFloat(invoiceHasItem.saleprice) - (parseFloat(invoiceHasItem.saleprice) * parseFloat(batch.discountratio) / 100);
        invoiceHasItem.lastsaleprice = txtLastSalePrice.value;
        txtLastSalePrice.style.border = valid;
    } /*else if (discountLocal.value == 0) {
        txtLastSalePrice.value = txtSalesPrice.value;
        invoiceHasItem.lastsaleprice = txtLastSalePrice.value;
        txtLastSalePrice.style.border = valid;
    }*/

    discountDisplay.innerHTML = parseFloat((batch.discountratio));

    txtSalesPrice.style.border = valid;
    txtSalesPrice.style.border = valid;


}

function checkavailability() {
    if (txtQty.value > txtavailbleqty.value) {
        swal({
            title: "Insufiecient Quanityt !!!",
            text: "\n",
            icon: "error",
            time: 1200,
            button: false,
            dangerMode: true,
        });
    }
}

//calculate the line total of the item
function lineTot() {
    //saleprice
    availebleqty = parseFloat(JSON.parse(cmbBatch.value).availableqty);
    if (availebleqty >= parseFloat(txtQty.value)) {
        if (txtQty.value == "") {
            txtLineTotal.value = "";
            txtQty.style.border = initial;
            txtLineTotal.style.border = initial;
        } else {
            txtLineTotal.value = (parseFloat(txtLastSalePrice.value) * (parseFloat(txtQty.value))).toFixed(2);
            txtLineTotal.style.border = valid;
            invoiceHasItem.linetotal = txtLineTotal.value;
        }
    } else {
        swal({
            title: "Available quantity exceed in this batch !!!",
            text: "\n Availble Quantity is -: " + parseFloat(JSON.parse(cmbBatch.value).availableqty),
            icon: "error",
            time: 1200,
            button: false,
            dangerMode: true,
        });

        txtQty.value = "";
        txtLineTotal.value = "";
        txtQty.style.border = initial;
        txtLineTotal.style.border = initial;
    }
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
        txtLineTotal.value = "";
        txtQty.style.border = initial;
        txtLineTotal.style.border = initial;

        return true;
    }
}



function cusTypecheck(){

}

function disableExistingCus(){

}

function cuscheck() {

    //getting customer orders according to the customer
    corders = httpRequest("/customerorder/cordersByCustomer?customerid=" + JSON.parse(cmbCustomer.value).id , "GET");
    fillCombo3Brac(cmbCustomerOrder , "Select Order" , corders , 'ordercode' , 'requireddate' , '');

    var textboxid = JSON.parse(cmbCustomer.value).id;

    txtCustomerName.value = "";
    txtCustomerMobile.value = "";

    txtCustomerName.disabled = true;
    txtCustomerMobile.disabled = true;


    if (textboxid != null) {
        $('#rowName').collapse('show');
        $('#rowmbileno').collapse('show');

        txtCusFirstName.disabled = true;
        txtCusLastName.disabled = true;
        txtCusMobile.disabled = true;

        $('#rownewCusName').collapse('hide');
        $('#rowCusMobile').collapse('hide');

        txtCusFirstName.value = JSON.parse(cmbCustomer.value).fname;
        txtCusLastName.value = JSON.parse(cmbCustomer.value).lname;
        txtCusMobile.value = JSON.parse(cmbCustomer.value).mobileno;

        royaltypoints = httpRequest("../royaltypoint/royalPointsBypoints?points=" + JSON.parse(cmbCustomer.value).points , "GET" );
        txtDiscountrat.value = parseFloat(royaltypoints.discount).toFixed(2);
        invoice.discountratio = txtDiscountrat.value;
        txtDiscountrat.style.border = valid;

    } else {

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
    invoices = new Array();
    var data = httpRequest("/invoice/findAll?page=" + page + "&size=" + size + query, "GET");
    console.log(data);
    if (data.content != undefined) invoices = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblInvoice', invoices, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblInvoice);

    if (activerowno != "") selectRow(tblInvoice, activerowno, active);

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
function viewitem(inv, rowno) {

    invoiceprint = JSON.parse(JSON.stringify(inv));

    tdBillNo.innerHTML = invoiceprint.invoiceno;
    //tdCOrder.innerHTML = invoiceprint.customerorder_id.name;
    tdNetAmount.innerHTML = invoiceprint.netamount;
    tdPaidAmount.innerHTML = invoiceprint.paidamount;
    tdNewBalanceAmount.innerHTML = invoiceprint.balanceamount;
    tdPaymentMethod.innerHTML = invoice.invoicepaymentmethod_id.name;
    tdAddedByView.innerHTML = invoiceprint.employee_id.callingname;
    tdDescriptionView.innerHTML = invoiceprint.description;
    tdDateTime.innerHTML = invoiceprint.invoicedatetime;

    //fillInnerTable("tblPrintInnerItem" , invoiceprint.invoiceHasItemList , innerModify , innerDelete, innerView);

    $('#InvoicePrintModal').modal('show')

}


function btnPrintRowMC() {
    var format = printformtable.outerHTML;
    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
        "<link rel=\'stylesheet\' href='resources/invoice/invoice.css'>" +
        "</head>"+
        "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'>" +
        "<body><div style='margin-top: 75px'>" +
        "<div class='row'>" +
        "<div class='col-md-8'>" +
        "<div style='font-weight: bold ; text-align: right ; font-size: xx-large'>OMEL LANKA Super Market</div>"+
        "</div>"+
        "<div class='col-md-4'>" +
        "<img src='resources/invoice/logo.png' width='50px' height='50px' style='text-align: center'>"+
        "</div>"+
        "</div>"+
        "<div class='row'>" +
        "<div class='col-md-12 ml-3 mt-2'><span style='text-align: left ; font-size: x-large ; font-weight: bold'>Invoice</span></div>"+
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

    dteAddedDate.style.border = style;
    cmbAddedBy.style.border = style;
    cmbStatus.style.border = style;
    txtInvoiceNo.style.border = style;
    cmbCustomer.style.border = style;
    txtCustomerName.style.border = style;
    txtCustomerMobile.style.border = style;
    txtDescription.style.border = style;
    txtTotamount.style.border = style;
    txtPaid.style.border = style;
    txtNetAmount.style.border = style;
    txtBalanceamount.style.border = style;

    cmbItem.style.border = style;
    cmbBatch.style.border = style;
    txtSalesPrice.style.border = style;
    txtQty.style.border = style;
    txtLineTotal.style.border = style;
}

function disableButtons(add, upd, del) {

    if (add || !privilages.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer')
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
    for (index in invoices) {
        tblInvoice.children[1].children[index].lastChild.children[0].style.display = "none";

        if (invoices[index].invoicestatus_id.name == "Deleted") {
            tblInvoice.children[1].children[index].style.color = "#f00";
            tblInvoice.children[1].children[index].style.border = "2px solid red";
            //  tblGRN.children[1].children[index].lastChild.children[1].disabled = true;
            //  tblGRN.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (invoice.invoiceno == null)
        errors = errors + "\n" + "Please Enter Valid Invoice No";
    else addvalue = 1;

    if (invoice.totalamount == null)
        errors = errors + "\n" + "Please Add items to the list";
    else addvalue = 1;

    if (invoice.totalamount == null)
        errors = errors + "\n" + "Please Add items to the list";
    else addvalue = 1;

    if(invoice.balanceamount == null){
        errors = errors + "\n" + "Please Enter valid paid amount. Paid amount cannot empty or less than net amount";
    }else addvalue = 1;

    if (invoice.invoiceHasItemList.length == 0) {
        cmbItem.style.border = invalid;
        errors = errors + "\n" + "Please Add the Items";
    }

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
        title: "Are You Sure to Bill ? ",
        text: "\nInvoice No : " + invoice.invoiceno +
            "\nNet Amount : " + invoice.netamount +
            "\nDiscount Ratio : " + invoice.discountratio +
            "\nDate : " + invoice.invoicedatetime +
            "\nReceived Date : " + invoice.invoicedatetime,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/invoice", "POST", invoice);
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
                $('#mainform').modal('hide');
                /*viewitem(invoice);*/
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

    if (oldinvoice == null && addvalue == "") {
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
                invoice.invoiceHasItemList = [];
                fillInnerTable("tblInnerItem", invoice.invoiceHasItemList, innerModify, innerDelete, innerView);
            }

        });
    }

}


//when clicking update button in table view
function fillForm(gr, rowno) {
    activepage = rowno;

    if (oldgrn == null) {
        filldata(gr);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(gr);
            }

        });
    }

}

function btnDeleteMC(inv) {
    invoice = JSON.parse(JSON.stringify(inv));

    swal({
        title: "Are you sure to delete following employee...?",
        text: "\nInvoice No : " + invoice.grncode +
            "\nNet Amount : " + invoice.netamount +
            "\nDiscount Ratio : " + invoice.discountratio +
            "\nDate : " + invoice.invoicedatetime +
            "\nReceived Date : " + invoice.receiveddate,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/invoice", "DELETE", invoice);
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

function btnPrintTableMC(supplier) {

    var newwindow = window.open();
    formattab = tblSupplier.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>supplier Details : </h1></div>" +
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

    var cprop = tblInvoice.firstChild.firstChild.children[cindex].getAttribute('property');

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
    fillTable('tblInvoice', employees, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblInvoice);
    loadForm();

    if (activerowno != "") selectRow(tblInvoice, activerowno, active);


}