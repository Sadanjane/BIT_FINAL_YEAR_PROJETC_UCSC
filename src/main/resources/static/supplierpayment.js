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

    //dteDOBirth.onchange = dteDOBirthCH;
    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=SPAYMENT", "GET");

    activesuppliers = httpRequest("../supplier/ActiveSup" , "GET");
    employees = httpRequest("../employee/list", "GET");
    paymentstatuses = httpRequest("../supplierpaymentstatus/list" , "GET");
    paymentmethods = httpRequest("../paymentmethod/list" , "GET");

    spayments = httpRequest("../supplierpayment/list" , "GET");

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
    spayment = new Object();
    oldspayment = null;

    //Get Next Number Form Data Base
    var nextNumber = httpRequest("/supplierpayment/nextbill", "GET");
    txtBillNo.value = nextNumber.billno;
    spayment.billno = txtBillNo.value;
    txtBillNo.disabled = "disabled";

    fillCombo(cmbStatus, "", paymentstatuses, "name", "Paid");
    fillCombo(cmbAddedBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    spayment.supplierpaymentstatus_id = JSON.parse(cmbStatus.value);
    cmbStatus.disabled = true;

    spayment.employee_id = JSON.parse(cmbAddedBy.value);
    cmbAddedBy.disabled = true;

    dteAddedDate.value =  getCurrentTimeDate("date");
    spayment.addeddate = dteAddedDate.value;
    dteAddedDate.disabled = true;

    txtPaidAmount.disabled = true;
    txtBalancedAmount.disabled = true;


    fillCombo(cmbSupplier , "Select Supplier" ,activesuppliers , "companyfullname" , "" );
    fillCombo(cmbPaymentMethod , "Select a Payment Method" ,paymentmethods , "name" , "cash" );
    spayment.paymentmethod_id = JSON.parse(cmbPaymentMethod.value);

    fillCombo(cmbGrn , "Select GRN" , '', '' , '' );

    txtPaidAmount.value = "";
    txtBalancedAmount.value = "";
    txtDescription.value = "";

    txtAreasAmount.value = parseFloat(0).toFixed(2);
    txtTotalAmount.value = parseFloat(0).toFixed(2);
    txtGrnAmount.value = parseFloat(0).toFixed(2);

    spayment.grnamount = txtGrnAmount.value;

    //bank transfer
    txtBankNameT.value = "";
    txtAccountNoT.value = "";
    txtBankHolderT.value = "";
    dteDepositTimeT.value = "";
    txtTransferID.value = "";

    //bank
    txtBankName.value = "";
    txtAccountNo.value = "";
    txtBankHolder.value = "";
    dteDepositTime.value = "";

    //check
    txtCheck.value = "";
    dteCheck.value = "";

    txtAreasAmount.disabled = true;
    txtGrnAmount.disabled = true;
    txtTotalAmount.disabled = true;

    // removeFile('flePhoto');

    setStyle(initial);

    txtBillNo.style.border = valid;
    dteAddedDate.style.border = valid;
    cmbAddedBy.style.border = valid;
    cmbStatus.style.border = valid;
    cmbPaymentMethod.style.border = valid;

    disableButtons(false, true, true);
}
//calculate balance amount when entering the paid amount
function calculateBalanc(){
    if(txtPaidAmount.value < 0 || txtPaidAmount.value > spayment.totalamount){
        swal({
            position: 'center',
            icon: 'warning',
            title: "Invaid Amount !",
            text: 'Your amount must in between 0 and total amount or equal to total amount',
            button: false
        });
        txtPaidAmount.value = "";
        txtPaidAmount.style.border = invalid;
        txtBalancedAmount.value = "";
        txtBalancedAmount.style.border = initial;
    }else {
        txtBalancedAmount.value = (parseFloat(txtPaidAmount.value) - parseFloat(spayment.totalamount)).toFixed(2);
        txtBalancedAmount.style.border = valid;
        spayment.balanceamount = txtBalancedAmount.value;
    }


    txtBalancedAmount.value = (parseFloat(spayment.totalamount) - parseFloat(txtPaidAmount.value)).toFixed(2);
    txtBalancedAmount.style.border = valid;
    spayment.balanceamount = txtBalancedAmount.value;
}


//filter grns according to the selected supplier
function filterGrns(){
    grns = httpRequest("../grn/grnfilltered?supplierid="+JSON.parse(cmbSupplier.value).id , "GET");
    fillCombo(cmbGrn , "Select GRN" ,grns , "grncode" , "" );

    txtGrnAmount.value = parseFloat(0).toFixed(2);
    txtGrnAmount.style.border = initial;
    cmbGrn.style.border = initial;

}
//filter areas amount of the selected supplier
function fliterAreas(){
    txtAreasAmount.value = (parseFloat(JSON.parse(cmbSupplier.value).areasamount)).toFixed(2);
    txtAreasAmount.style.border = valid;
    txtTotalAmount.value = txtAreasAmount.value;
    spayment.totalamount = txtTotalAmount.value;
    txtTotalAmount.style.border = valid;

    txtPaidAmount.disabled = false;

    txtCreditLimit.innerHTML = (parseFloat(JSON.parse(cmbSupplier.value).creditlimit)).toFixed(2);
}
//filter grn amount according to the selected grn
function filtergrn(){
    txtGrnAmount.value = (parseFloat(JSON.parse(cmbGrn.value).grossamount)).toFixed(2);
    txtGrnAmount.style.border = valid;
    spayment.grnamount = txtGrnAmount.value;
}

//calaculate total amount when select the supplier or grn using areas amount and gross amount
function calculateTotal(){
        txtTotalAmount.value = (parseFloat(txtGrnAmount.value) + parseFloat(txtAreasAmount.value)).toFixed(2);
        txtTotalAmount.style.border = valid;
        spayment.totalamount = txtTotalAmount.value;
}

//togle text boxes according to the payment method
function togleTextBox(){
    var textboxid = JSON.parse(cmbPaymentMethod.value).id;
    if(textboxid == 1){
        $('#check').collapse('hide')
        $('#bank').collapse('hide')
        $('#banktransfer').collapse('hide')

        txtBankNameT.value = "";
        txtAccountNoT.value = "";
        txtBankHolderT.value = "";
        dteDepositTimeT.value = "";
        txtTransferID.value = "";

        txtBankName.value = "";
        txtAccountNo.value = "";
        txtBankHolder.value = "";
        dteDepositTime.value = "";

        txtCheck.value = "";
        dteCheck.value = "";

        txtBankNameT.style.border = initial;
        txtAccountNoT.style.border = initial;
        txtBankHolderT.style.border = initial;
        dteDepositTimeT.style.border = initial;
        txtTransferID.style.border = initial;
        txtBankName.style.border = initial;
        txtAccountNo.style.border = initial;
        txtBankHolder.style.border = initial;
        dteDepositTime.style.border = initial;
        txtCheck.style.border = initial;
        dteCheck.style.border = initial;

    }
    else if (textboxid == 2){
        $('#check').collapse('show')
        $('#bank').collapse('hide')
        $('#banktransfer').collapse('hide')

        txtBankNameT.value = "";
        txtAccountNoT.value = "";
        txtBankHolderT.value = "";
        dteDepositTimeT.value = "";
        txtTransferID.value = "";

        txtBankName.value = "";
        txtAccountNo.value = "";
        txtBankHolder.value = "";
        dteDepositTime.value = "";

        txtBankNameT.style.border = initial;
        txtAccountNoT.style.border = initial;
        txtBankHolderT.style.border = initial;
        dteDepositTimeT.style.border = initial;
        txtTransferID.style.border = initial;
        txtBankName.style.border = initial;
        txtAccountNo.style.border = initial;
        txtBankHolder.style.border = initial;
        dteDepositTime.style.border = initial;
    }
    else if(textboxid == 3){
        $('#check').collapse('hide')
        $('#bank').collapse('show')
        $('#banktransfer').collapse('hide')

        txtBankNameT.value = "";
        txtAccountNoT.value = "";
        txtBankHolderT.value = "";
        dteDepositTimeT.value = "";
        txtTransferID.value = "";

        txtCheck.value = "";
        dteCheck.value = "";

        txtBankNameT.style.border = initial;
        txtAccountNoT.style.border = initial;
        txtBankHolderT.style.border = initial;
        dteDepositTimeT.style.border = initial;
        txtTransferID.style.border = initial;
        txtCheck.style.border = initial;
        dteCheck.style.border = initial;
    }
    else if(textboxid == 4){
        $('#check').collapse('hide')
        $('#bank').collapse('hide')
        $('#banktransfer').collapse('show')

        txtBankName.value = "";
        txtAccountNo.value = "";
        txtBankHolder.value = "";
        dteDepositTime.value = "";

        txtCheck.value = "";
        dteCheck.value = "";

        txtBankName.style.border = initial;
        txtAccountNo.style.border = initial;
        txtBankHolder.style.border = initial;
        dteDepositTime.style.border = initial;
        txtCheck.style.border = initial;
        dteCheck.style.border = initial;
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
    spayments = new Array();
    var data = httpRequest("/supplierpayment/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) spayments = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblSPayment', spayments, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblSPayment);

    if (activerowno != "") selectRow(tblSPayment, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldspayment == null) {
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
function viewitem(supret, rowno) {

    supRet = JSON.parse(JSON.stringify(supret));

    tdBill.innerHTML = supRet.billno;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    tdPrinted.innerHTML = date+' '+time;

    tdSupplier.innerHTML = supRet.supplier_id.companyfullname;
    tdGRN.innerHTML = supRet.grn_id.grncode;
    tdAreusAmount.innerHTML = supRet.supplier_id.areasamount;
    tdGRNAmount.innerHTML = supRet.grnamount;
    tdTotal.innerHTML = supRet.totalamount;
    tdPaidAmount.innerHTML = supRet.paidamount;
    tdBalanceAmount.innerHTML = supRet.balanceamount;

    tdAddedBy.innerHTML = supRet.employee_id.callingname;
    tdStatus.innerHTML = supRet.supplierpaymentstatus_id.name;
    tdAdded.innerHTML = supRet.depositdatetime;

    $('#supplierPaymentViewModel').modal('show')

}

function btnPrintRowMC() {
    var format = printformtable.outerHTML;
    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'>" +
        "<body><div style='margin-top: 150px'><h1>supplier Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

//set styles to the form

function setStyle(style) {

    txtBillNo.style.border = style;
    cmbSupplier.style.border = style;
    cmbGrn.style.border = style;
    txtAreasAmount.style.border = style;
    txtGrnAmount.style.border = style;
    txtTotalAmount.style.border = style;
    txtPaidAmount.style.border = style;
    txtBalancedAmount.style.border = style;
    cmbPaymentMethod.style.border = style;
    txtDescription.style.border = style;

    txtBankNameT.style.border = style;
    txtAccountNoT.style.border = style;
    txtBankHolderT.style.border = style;
    dteDepositTimeT.style.border = style;
    txtTransferID.style.border = style;

    txtBankName.style.border = style;
    txtAccountNo.style.border = style;
    txtBankHolder.style.border = style;
    dteDepositTime.style.border = style;

    txtCheck.style.border = style;
    dteCheck.style.border = style;

}

function disableButtons(add, upd, del) {

    if (add || !privilages.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer')
    }

    if (!privilages.delete) {
        $(".buttondel").prop('disabled', true);
        $(".buttondel").css('cursor', 'not-allowed');
    } else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor', 'pointer');
    }

    // select deleted data row
    for (index in spayments) {
        tblSPayment.children[1].children[index].lastChild.children[0].style.display = "none";
        tblSPayment.children[1].children[index].lastChild.children[1].style.display = "none";

        if (spayments[index].supplierpaymentstatus_id.name == "Deleted") {
            tblSPayment.children[1].children[index].style.color = "#f00";
            tblSPayment.children[1].children[index].style.border = "2px solid red";
            tblSPayment.children[1].children[index].lastChild.children[1].disabled = true;
            tblSPayment.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (spayment.billno== null)
        errors = errors + "\n" + "Please Enter A Valid Bill No";
    else addvalue = 1;

    if (spayment.supplier_id == null)
        errors = errors + "\n" + "Please Select the Supplier";
    else addvalue = 1;

    if (spayment.paidamount == null)
        errors = errors + "\n" + "Please Enter the Paid Amount";
    else addvalue = 1;

    if (spayment.paymentmethod_id == null)
        errors = errors + "\n" + "Please Select the Payment Method";
    else addvalue = 1;

    if(spayment.balanceamount > JSON.parse(cmbSupplier.value).creditlimit)
        errors = errors + "\n" + "Supplier Credit Limit Exceeded";
    else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtDescription.value == "") {
            swal({
                title: "Are you sure to continue...?",
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
        title: "Are You Sure to add The Supplier Payment ? ",
        text: "\nBill No : " + spayment.billno +
            "\nSupplier : " + spayment.supplier_id.companyfullname +
            "\nPayment Method : " + spayment.paymentmethod_id.name +
            "\nBalanced Amount: " + spayment.balanceamount +
            "\nAdded Date : " + spayment.addeddate +
            "\nSupplier Payment Status : " + spayment.supplierpaymentstatus_id.name ,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/supplierpayment", "POST", spayment);
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

    if (oldspayment == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values Do you want to discrd all values?",
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
function fillForm(suppay, rowno) {
    activepage = rowno;

    if (oldsupreturn == null) {
        filldata(suppay);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(suppay);
            }

        });
    }

}

//fill data to the form
function filldata(suppay) {
    clearSelection(tblSupplierReturn);
    selectRow(tblSupplierReturn, activepage, active);

    supreturn = JSON.parse(JSON.stringify(suppay));
    oldsupreturn = JSON.parse(JSON.stringify(suppay));

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

function btnDeleteMC(sup) {
    supplier = JSON.parse(JSON.stringify(sup));

    swal({
        title: "Are you sure to delete following employee...?",
        text: "\nBill No : " + spayment.billno +
            "\nSupplier : " + spayment.supplier_id.companyfullname +
            "\nGRN : " + spayment.grn_id.grncode +
            "\nPayment Method : " + spayment.paymentmethod_id.name +
            "\nBalanced Amount: " + spayment.balanceamount +
            "\nAdded Date : " + spayment.addeddate +
            "\nSupplier Payment Status : " + spayment.supplierpaymentstatus_id.name ,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/supplierpayment", "DELETE", spayment);
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