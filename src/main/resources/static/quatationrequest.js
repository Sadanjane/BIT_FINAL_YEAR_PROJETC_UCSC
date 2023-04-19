window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {

    //tooltip
    $('[data-toggle="tooltip"]').tooltip();
    $('.js-example-basic-single').select2();

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    //dteDOBirth.onchange = dteDOBirthCH;
    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=QUOTATTIONREQ", "GET");
    employees = httpRequest("../employee/list", "GET");
    quatationreqstatuses = httpRequest("../quatationreqstatus/list", "GET");
    quatationrequests  = httpRequest("../quatationrequest/list" , "GET");
    supplierstatuses = httpRequest("supplierstatus/list", "GET");
    activesuppliers = httpRequest("../supplier/ActiveSup?status=4" , "GET");
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
    quatationreq = new Object();
    oldquatationreq = null;

    //create a new array (INNER FORM)
   //supplier.supplierHasItemList = new Array();

    fillCombo(QTRstatus, "", quatationreqstatuses, "name", "Requested");
    fillCombo(QTRemployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    fillCombo(QTRsupplier , "select suppier" , activesuppliers , "companyfullname", "");

    quatationreq.quatationrequeststatus_id = JSON.parse(QTRstatus.value);
    QTRstatus.disabled = true;

    quatationreq.employee_id = JSON.parse(QTRemployee.value);
    QTRemployee.disabled = true;

    //set min and max dates for require date
    QTRrequiredate.min = getCurrentTimeDate("date");

    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 365);
    QTRrequiredate.max = maxDate.getFullYear()+"-"+getmonthdate(maxDate);


    QTRdate.value =  getCurrentTimeDate("date");
    quatationreq.addeddate = QTRdate.value;
    QTRdate.disabled = true;

    //Get Next Number Form Data Base
    var nextNumber = httpRequest("/quatationrequest/nextnumber", "GET");
    QTRNo.value = nextNumber.qrno;
    quatationreq.qrno = QTRNo.value;
    QTRNo.disabled = "disabled";

    QTRsupplier.value = "";
    QTRdescription.value = "";

    setStyle(initial);
    QTRdate.style.border = valid;
    QTRemployee.style.border = valid;
    QTRstatus.style.border = valid;
    QTRNo.style.border = valid;

    disableButtons(false, true, true);
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
    quatationrequests = new Array();
    var data = httpRequest("/quatationrequest/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) quatationrequests = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblQuotationRequest', quatationrequests, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblQuotationRequest);

    if (activerowno != "") selectRow(tblQuotationRequest, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldquatationreq == null) {
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

    qtrequest = JSON.parse(JSON.stringify(qtr));

    tdQRNo.innerHTML = qtrequest.qrno;
    tdSupplier.innerHTML = qtrequest.supplier_id.companyfullname;
    tdRequire.innerHTML = qtrequest.requireddate;

    if(qtrequest.description == null){
        tdDescription.innerHTML = "-";
    }else{
        tdDescription.innerHTML = qtrequest.description;
    }

    tdStatus.innerHTML = qtrequest.quatationrequeststatus_id.name;
    tdAddedBy.innerHTML = qtrequest.employee_id.callingname;

    $('#dataViewModel').modal('show')

}

function btnPrintRowMC() {
    var format = printformtable.outerHTML;
    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'>" +
        "<body><div style='margin-top: 150px'><h1>Quotation Request Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

//set styles to the form

function setStyle(style) {

    QTRNo.style.border = style;
    QTRsupplier.style.border = style;
    QTRrequiredate.style.border = style;
    QTRdescription.style.border = style;
    QTRstatus.style.border = style;

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
    for (index in quatationrequests) {
        if (quatationrequests[index].quatationrequeststatus_id.name == "Deleted") {
            tblQuotationRequest.children[1].children[index].style.color = "#f00";
            tblQuotationRequest.children[1].children[index].style.border = "2px solid red";
            tblQuotationRequest.children[1].children[index].lastChild.children[1].disabled = true;
            tblQuotationRequest.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}


function getErrors() {

    var errors = "";
    addvalue = "";

    if (quatationreq.supplier_id== null)
        errors = errors + "\n" + "Please Select a Supplier";
    else addvalue = 1;

    if (quatationreq.requireddate == null)
        errors = errors + "\n" + "Please Select a Date";
    else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (QTRdescription.value == "") {
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
            title: "You Have Following Errors",
            text: "\n" + getErrors(),
            icon: "error",
            button: true,
        });

    }
}

function savedata() {

    swal({
        title: "Are you sure to place a quatation request ?",
        text: "\nQuatation request No : " + quatationreq.qrno +
            "\nSupplier : " + quatationreq.supplier_id.companyfullname +
            "\nRequire Date : " + quatationreq.requireddate +
            "\nDescription : " + quatationreq.description +
            "\nStatus : " + quatationreq.quatationrequeststatus_id.name +
            "\nAdded By : " + quatationreq.employee_id.callingname ,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/quatationrequest", "POST", quatationreq);
            console.log(response);
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
                $('#mainform').modal('hide');
            } else swal({
                title: 'Save Not Success... , You Have Following Errors', icon: "error",
                text: '\n ' + response,
                button: true
            });
        }
    });

}

function btnClearMC() {
    checkerr = getErrors();

    if (oldquatationreq == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form Has Some Values / Updates Values... Are You Sure To Discard The Form ?",
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
function fillForm(qtr, rowno) {
    activepage = rowno;

    if (oldquatationreq == null) {
        filldata(qtr);
    } else {
        swal({
            title: "Form Has Some Values /  Updates Values... Are You Sure To Discard The Form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(qtr);
            }

        });
    }

}

//fill data to the form
function filldata(qtr) {
    clearSelection(tblQuotationRequest);
    selectRow(tblQuotationRequest, activepage, active);

    quatationreq = JSON.parse(JSON.stringify(qtr));
    oldquatationreq = JSON.parse(JSON.stringify(qtr));

    //cannot change
    QTRNo.value = quatationreq.qrno;
    QTRNo.disabled = "disabled";

    QTRrequiredate.value = quatationreq.requireddate;

    fillCombo(QTRsupplier , "" , activesuppliers , "companyfullname" , quatationreq.supplier_id.companyfullname);
    QTRsupplier.disabled = false;

    //cannot change
    fillCombo(QTRemployee, "" , employees , "callingname" , quatationreq.employee_id.callingname);
    QTRemployee.disabled = "disabled";

    fillCombo(QTRstatus , "" , quatationreqstatuses , "name" , quatationreq.quatationrequeststatus_id.name);
    QTRstatus.disabled = false;

    QTRdescription.value = quatationreq.description;

    disableButtons(true, false, false);
    setStyle(valid);
    $('#mainform').modal('show');

    //OPTIONAL FIELDS
    if(quatationreq.description == null)
        QTRdescription.style.border = initial;
}

function getUpdates() {

    var updates = "";

    if (quatationreq != null && oldquatationreq != null) {

        if (quatationreq.supplier_id.companyfullname!= oldquatationreq.supplier_id.companyfullname)
            updates = updates + "\nSupplier is Changed";

        if (quatationreq.requireddate != oldquatationreq.requireddate)
            updates = updates + "\nRequired Date is Changed";

        if (quatationreq.description != oldquatationreq.description)
            updates = updates + "\nDescription is Changed";

        if (quatationreq.quatationrequeststatus_id.name != oldquatationreq.quatationrequeststatus_id.name)
            updates = updates + "\nStatus is Changed";
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
                title: "Are You Sure To Update Following Quaotation Request Details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/quatationrequest", "PUT", quatationreq);
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
                            changeTab('table');

                        } else window.alert("Failed to Update as \n\n" + response );
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

function btnDeleteMC(qtr) {
    quatationreq = JSON.parse(JSON.stringify(qtr));

    swal({
        title: "Are You Sure To Delete Following Quaotation Request...?",
        text: "\nQuotation Request No : " + quatationreq.qrno +
            "\n Supplier : " + quatationreq.supplier_id.companyfullname +
            "\n Require Date : " + quatationreq.requireddate+
            "\n Requested Quotation Statrus : " + quatationreq.quatationrequeststatus_id.name,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/quatationrequest", "DELETE", quatationreq);
            if (responce == 0) {
                swal({
                    title: "Deleted Successfully....!",
                    text: "\n\n  Status Change to Delete",
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

function btnPrintTableMC(qtr) {

    var newwindow = window.open();
    formattab = tblQuotationRequest.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Quotation Request Details : </h1></div>" +
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
    fillTable('tblQuotationRequest', quatationrequests, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblQuotationRequest);
    loadForm();

    if (activerowno != "") selectRow(tblQuotationRequest, activerowno, active);


}