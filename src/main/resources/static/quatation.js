window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {

    //tooltip
    $('[data-toggle="tooltip"]').tooltip();
    $('.js-example-basic-single').select2();

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    QTvalidfrom.addEventListener("change", validTo); //unlit valid from change valid to date picker is disabled

    //dteDOBirth.onchange = dteDOBirthCH;
    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=QUOTATION", "GET");
    employees = httpRequest("../employee/list", "GET");

    quatationstatuses = httpRequest("../quatationstatus/list", "GET");
    quatationrequests = httpRequest("../quatationrequest/list", "GET");

    activesuppliers = httpRequest("../supplier/ActiveSup?status=4", "GET");
    quatations = httpRequest("../quatation/list", "GET");
    items = httpRequest("../item/list", "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2"; //d6d6c2
    updated = "2px solid #ff9900";
    active = "#ff9900";

    loadView();
    loadForm();


    //console.log(QTfreeitems.value);

}

//auto load require values to the form

function loadForm() {
    quatation = new Object();
    oldquatation = null;

    //create a new array (INNER FORM)
    quatation.quatationHasItemList = new Array();

    //Get Next Number Form Data Base
    var nextNumber = httpRequest("/quatation/nextnumber", "GET");
    QTcode.value = nextNumber.quatationcode;
    quatation.quatationcode = QTcode.value;
    QTcode.disabled = "disabled";

    fillCombo(QTstatus, "", quatationstatuses, "name", "Active");
    fillCombo(QTaddedby, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    quatation.quatationstatus_id = JSON.parse(QTstatus.value);
    QTstatus.disabled = true;

    quatation.employee_id = JSON.parse(QTaddedby.value);
    QTaddedby.disabled = true;

    fillCombo(QTsupplier, "Select supplier", activesuppliers, "companyfullname", "");

    //set min and max dates for valid to date

    /*  Valid From  - Ada sita idiriyata
                  min  - ada
                  max - sathiyak dakwa
              Valid to -
                  min - sathiyakata passe
                  max - 1 year
              received  -
              min - adata dawas 3k pitipasse
              max - ada
              */

    /*received date*/
    let minDate = new Date();
    minDate.setDate(minDate.getDate() - 3);
    QTreceived.min = minDate.getFullYear() + "-" + getmonthdate(minDate);

    QTreceived.max = getCurrentTimeDate("date");


    /*valid from*/  /*ada idala dawas 7k yanakan*/
    QTvalidfrom.min = getCurrentTimeDate("date");
    let validFromMax = new Date();
    validFromMax.setDate(validFromMax.getDate() + 7);
    QTvalidfrom.max = validFromMax.getFullYear() + "-" + getmonthdate(validFromMax);

    QTaddeddate.value = getCurrentTimeDate("date");
    quatation.addeddate = QTaddeddate.value;
    QTaddeddate.disabled = true;

    QTvalidto.disabled = true;  //until user click valid from data valid to date picker is disabled

    QTsupplierqno.value = "";
    /*QTreceived.value = "";
    QTvalidfrom.value = "";
    QTvalidto.value = "";*/
    QTdescription.value = "";

    setStyle(initial);
    QTcode.style.border = valid;
    QTaddeddate.style.border = valid;
    QTaddedby.style.border = valid;
    QTstatus.style.border = valid;

    disableButtons(false, true, true);
    //calling the inner form function
    refreshInnerForm();
}

function validTo(){

    QTvalidto.disabled = false;

    /*valid to*/ /*valid to min eka current date eke idala daws 8k issrhata and max eka aurudu eka hamarak yanakn*/
    var currentdate = new Date();
    currentdate.setDate(currentdate.getDate() + 8);
    QTvalidto.min = currentdate.getFullYear() + "-" + getmonthdate(currentdate);

    let validToMax = new Date();
    validToMax.setDate(currentdate.getDate() + 365);
    QTvalidto.max = validToMax.getFullYear() + "-" + getmonthdate(validToMax);

}

function cmbSuppiler() {

    if(quatation.quatationHasItemList.length != 0 ){
        selectedqtreq = JSON.parse(QTrequestid.value);
        swal({
            title: "Table Has Some Values. Do You Want to Discard them ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                quatation.quatationHasItemList = [];
                fillInnerTable("tblInnerQuatation" ,quatation.quatationHasItemList , innerModify , innerDelete, innerView);
            }else{
                fillCombo(QTsupplier ,"" , activesuppliers ,"companyfullname" , selectedsupplier.companyfullname );
                fillCombo(QTrequestid , "" , quatationreqbyid , "qrno" , selectedqtreq.qrno );
                QTrequestid.style.border = valid;
            }
        });
    }else{
        selectedsupplier = JSON.parse(QTsupplier.value);
    }
    quatationreqbyid = httpRequest("/quatationrequest/listBySupplier?supplierid=" + JSON.parse(QTsupplier.value).id, "GET");
    fillCombo(QTrequestid, "select a Quatation req ID", quatationreqbyid, "qrno", "");

    itemsbysupplier = httpRequest("/item/listBySupplier?supplierid=" + JSON.parse(QTsupplier.value).id, "GET");
    fillCombo(QTcmbSelectItems, "Select the Items", itemsbysupplier, "itemname", "");

    QTrequestid.disabled = false;
    QTrequestid.style.border = initial;

    QTcmbSelectItems.disabled = true;
    QTcmbSelectItems.style.border = initial;

}

function cmbQuatationReq() {

    QTcmbSelectItems.disabled = false;
}

function cmbSelectItemsCH() {

    QTpurchase.disabled = false;
    QTpurchase.value = "";
    QTlastprice.disabled = false;
    QTlastprice.value = "";
    QTquantity.disabled = false;
    QTquantity.value = "";
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
    quatations = new Array();
    var data = httpRequest("/quatation/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) quatations = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblQuatation', quatations, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblQuatation);

    if (activerowno != "") selectRow(tblQuatation, activerowno, active);

}

//INNER FORM FUNCTIONS//////////////////////////////////////////////////////////////////////////////

//FILLING THE INNER FORM AND TABLE
function refreshInnerForm() {
    quatationHasItem = new Object();
    oldQuatationHasItem = null;

    //setStyle(initial);

    QTpurchase.style.border = initial;
    QTlastprice.style.border = initial;
    QTquantity.style.border = initial;
    $("#QTcmbSelectItems .select2-container").css('border' , initial);


    QTcmbSelectItems.disabled = false;
    QTpurchase.disabled = false;
    QTlastprice.disabled = false;
    QTquantity.disabled = false;

    QTpurchase.value = "";
    QTlastprice.value = "";
    QTcmbSelectItems.value = "";
    //  quatationHasItem. =  QTlastprice.value
    QTquantity.value = "";

    /*itemsbysupplier = httpRequest("/item/listBySupplier?supplierid=" + JSON.parse(QTsupplier.value).id, "GET");
    fillCombo(QTcmbSelectItems, "Select the Items", itemsbysupplier, "itemname", "");*/
    /*QTcmbSelectItems.style.border = initial;*/

    //INNER FORM
    //AUTO FILL DATA
    //fillCombo(selectItem,"Select Item",items,"itemname","");
    /* if(QTrequestid.value != ""){
         itemsbysupplier = httpRequest("/item/listBySupplier?supplierid="+JSON.parse(QTsupplier.value).id , "GET");
         fillCombo(QTcmbSelectItems , "Select the Items" , itemsbysupplier , "itemname" , "" );
         QTcmbSelectItems.disabled  = false;
     }*/

    //INNER TABLE
    fillInnerTable("tblInnerQuatation", quatation.quatationHasItemList, false, innerDelete, false);
    /*if (quatation.quatationHasItemList.length != 0) {
        for (var index in quatation.quatationHasItemList) {
            tblInnerQuatation.children[1].children[index].lastChild.children[0].style.display = "none";
        }
    }*/
}

function btnInnerAddMC() {

    var itmExist = false;

    if (QTpurchase.value == "" || QTlastprice.value == "" || QTquantity.value == "") {
        swal({
            title: "Some Fields Have Empty !!!",
            text: "\n",
            icon: "warning",
            time: 1200,
            button: false,
            dangerMode: true,
        });
    } else if (QTquantity.value == "0") {
        swal({
            title: "Quantity Cannot Be Zero !!!",
            text: "\n",
            icon: "error",
            time: 1200,
            button: false,
            dangerMode: true,
        });
        QTquantity.style.border = invalid;
    } else {
        for (var index in quatation.quatationHasItemList) {
            if (quatation.quatationHasItemList[index].item_id.itemname == quatationHasItem.item_id.itemname) {
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
            quatation.quatationHasItemList.push(quatationHasItem);
            refreshInnerForm();
        }
    }
}

function btnInnerDeleteMC() {

    if (QTpurchase.value == "" || QTlastprice.value == "" || QTquantity.value == "" || QTcmbSelectItems.value == "") {
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

function innerModify() {

}

function innerDelete(innerob, innerrow) {
    swal({
        title: "Are You Sure to Delete Item??",
        text: "\n" + innerob.item_id.itemname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            quatation.quatationHasItemList.splice(innerrow, 1);
            refreshInnerForm();
        }

    });

}

function innerView() {

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
function viewitem(qtr, rowno) {

    quotationrow = JSON.parse(JSON.stringify(qtr));

    tdQTCode.innerHTML = quotationrow.quatationcode;
    tdSupplier.innerHTML = quotationrow.quatationrequest_id.supplier_id.companyfullname;
    tdQTRId.innerHTML = quotationrow.quatationrequest_id.qrno;
    tdSupQTNo.innerHTML = quotationrow.supplierqno;
    tdReceivedDate.innerHTML = quotationrow.receiveddate
    tdValid.innerHTML = quotationrow.validfrom;
    tdValidTo.innerHTML = quotationrow.validto;

    if(quotationrow.description == null){
        tdDescription.innerHTML = "-";
    }else{
        tdDescription.innerHTML = quotationrow.description;
    }

    tdAddedBy.innerHTML = quotationrow.employee_id.callingname;
    tdStatus.innerHTML = quotationrow.quatationstatus_id.name;
    tdAdded.innerHTML = quotationrow.addeddate;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    printDate.innerHTML = date+' '+time;

    fillInnerTable("printInnerTable" , quotationrow.quatationHasItemList , innerModify , innerDelete, innerView);
}

function btnPrintRowMC() {
    var format = printformtable.outerHTML;
    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'>" +
        "<body><div style='margin-top: 75px'>" +
        "<div class='row'>" +
        "<div class='col-md-8'>" +
        "<div style='font-weight: bold ; text-align: right ; font-size: xx-large'>OMEL LANKA Super Market</div>"+
        "</div>"+
        "<div class='col-md-4'>" +
        "<img src='resources/image/favicon.png' width='50px' height='50px' style='text-align: center'>"+
        "</div>"+
        "</div>"+
        "<div class='row'>" +
        "<div class='col-md-12 ml-3 mt-2'><span style='text-align: left ; font-size: x-large ; font-weight: bold'>Quotation Details</span></div>"+
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

    QTcode.style.border = style;
    QTrequestid.style.border = style;
    QTsupplierqno.style.border = style;
    QTreceived.style.border = style;
    QTvalidfrom.style.border = style;
    QTvalidto.style.border = style;
    QTdescription.style.border = style;
    QTstatus.style.border = style;
    QTaddedby.style.border = style;
    QTaddeddate.style.border = style;
    QTsupplier.style.border = style;

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
    for (index in quatations) {
        if (quatations[index].quatationstatus_id.name == "Deleted") {
            tblQuatation.children[1].children[index].style.color = "#f00";
            tblQuatation.children[1].children[index].style.border = "2px solid red";
            tblQuatation.children[1].children[index].lastChild.children[1].disabled = true;
            tblQuatation.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (quatation.quatationrequest_id == null)
        errors = errors + "\n" + "Please select the quatation request ID";
    else addvalue = 1;

    /*if (quatation.quatationrequest_id.supplier_id.companyfullname == null)
        errors = errors + "\n" + "Please Select a Supplier";
    else addvalue = 1;*/

    if (quatation.supplierqno == null)
        errors = errors + "\n" + "Please Enter the Quatation No";
    else addvalue = 1;

    if (quatation.receiveddate == null)
        errors = errors + "\n" + "Please Select the Quotation Received Date";
    else addvalue = 1;

    if (quatation.validfrom == null)
        errors = errors + "\n" + "Please Select the Valid from Date";
    else addvalue = 1;

    if (quatation.validto == null)
        errors = errors + "\n" + "Please Select the Valid To Date";
    else addvalue = 1;

    if (quatation.quatationHasItemList.length == 0) {
        QTcmbSelectItems.style.border = invalid;
        errors = errors + "\n" + "Please Insert Quatation Items";
    }

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (QTdescription.value == "") {
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
        title: "Are You Sure To Add Following Quatation...?",
        text: "\nQuatation Code : " + quatation.quatationcode +
            "\nSupplier Name : " + quatation.quatationrequest_id.supplier_id.companyfullname +
            "\nQuatation Request ID : " + quatation.quatationrequest_id.qrno +
            "\nSupplier Quatation ID : " + quatation.supplierqno +
            "\nAdded Date : " + quatation.addeddate +
            "\nStatus: " + quatation.quatationstatus_id.name,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/quatation", "POST", quatation);
            if (response == "0") {
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Your Work Has Been Done \n Save SuccessFully..!',
                    text: '\n',
                    button: false,
                    timer: 1200
                });
                activepage = 1;
                loadSearchedTable();
                loadForm();
                refreshInnerForm();
                $('#maintable').modal('hide');
            } else swal({
                title: 'Save Not Success... , You Have Following Errors', icon: "error",
                text: '\n ' + response,
                button: true
            });
        }
    });

}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if (oldquatation == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form Has Some ValueS / Updates Values... Are You Sure To Discard The Form ?",
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
function fillForm(qt, rowno) {
    activepage = rowno;

    if (oldquatation == null) {
        filldata(qt);
    } else {
        swal({
            title: "Form Has Some ValueS / Updates Values... Are You Sure To Discard The Form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(qt);
                $('#maintable').modal('show');
            }

        });
    }

}

//fill data to the form
function filldata(qt) {
    clearSelection(tblQuatation);
    selectRow(tblQuatation, activepage, active);

    quatation = JSON.parse(JSON.stringify(qt));
    oldquatation = JSON.parse(JSON.stringify(qt));

    //cannot change
    QTcode.value = quatation.quatationcode;
    QTcode.disabled = "disabled";

    //cannot change
    QTaddeddate.value = quatation.addeddate;
    QTaddeddate.disabled = "disabled";

    //cannot change
    fillCombo(QTaddedby, "", employees, "callingname", quatation.employee_id.callingname);
    QTaddedby.disabled = "disabled";

    fillCombo(QTstatus, "", quatationstatuses, "name", quatation.quatationstatus_id.name);
    QTstatus.disabled = false;

    //cannot change
    fillCombo(QTsupplier, "", activesuppliers, "companyfullname", quatation.quatationrequest_id.supplier_id.companyfullname);
    QTsupplier.disabled = "disabled";

    quatationreqbyid = httpRequest("/quatationrequest/listBySupplier?supplierid=" + JSON.parse(QTsupplier.value).id, "GET");
    fillCombo(QTrequestid, "select a Quatation req ID", quatationreqbyid, "qrno", quatation.quatationrequest_id.qrno);
    QTrequestid.disabled = false;

    itemsbysupplier = httpRequest("/item/listBySupplier?supplierid=" + JSON.parse(QTsupplier.value).id, "GET");
    fillCombo(QTcmbSelectItems, "Select the Items", itemsbysupplier, "itemname", quatation.quatationHasItemList.item_id);

    QTsupplierqno.value = quatation.supplierqno;
    QTreceived.value = quatation.receiveddate;
    QTvalidfrom.value = quatation.validfrom;
    QTvalidto.value = quatation.validto;
    QTdescription.value = quatation.description;

    disableButtons(true, false, false);
    setStyle(valid);
    $('#maintable').modal('show');

    //OPTIONAL FIELDS
    if (quatation.QTdescription == null)
        QTdescription.style.border = initial;
    // refresh inner
    refreshInnerForm();
}

function getUpdates() {

    var updates = "";

    if (quatation != null && oldquatation != null) {

        if (quatation.supplierqno != oldquatation.supplierqno)
            updates = updates + "\nSupplier Quatation Number is Changed";

        if (quatation.receiveddate != oldquatation.receiveddate)
            updates = updates + "\nReceived Date is Changed";

        if (quatation.validfrom != oldquatation.validfrom)
            updates = updates + "\nValid Time Period is Changed";

        if (quatation.validto != oldquatation.validto)
            updates = updates + "\nValid Time Period is Changed";

        if (quatation.description != oldquatation.description)
            updates = updates + "\nDescription is Changed";

        if (quatation.quatationstatus_id.name != oldquatation.quatationstatus_id.name)
            updates = updates + "\nQuataion Status is Changed";

        if (isEqual(quatation.quatationHasItemList, oldquatation.quatationHasItemList, "item_id"))
            updates = updates + "\nQuatation Item is Changed";

        if (isEqual(quatation.quatationHasItemList, oldquatation.quatationHasItemList, "purchaseprice"))
            updates = updates + "\nQuatation Item is Changed";

        if (isEqual(quatation.quatationHasItemList, oldquatation.quatationHasItemList, "lastpurchaseprice"))
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
                title: "Are you sure to update following Quatation details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/quatation", "PUT", quatation);
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
                            $('#maintable').modal('hide');

                        } else{
                            swal({
                                position: 'center',
                                icon: 'danger',
                                title: "Failed to Update as \n\n" + response,
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                        }
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

function btnDeleteMC(qt) {
    quatation = JSON.parse(JSON.stringify(qt));

    swal({
        title: "Are you sure to delete following quatation...?",
        text: "\nReg No : " + quatation.quatationcode +
            "\n Supplier : " + quatation.quatationrequest_id.supplier_id.companyfullname +
            "\n Quotation Request No : " + quatation.quatationrequest_id.qrno,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/quatation", "DELETE", quatation);
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
    formattab = tblQuatation.outerHTML;

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
        "<div class='col-md-12 ml-3 mt-2'><span style='text-align: left ; font-size: x-large ; font-weight: bold'>Quotation Details</span></div>"+
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