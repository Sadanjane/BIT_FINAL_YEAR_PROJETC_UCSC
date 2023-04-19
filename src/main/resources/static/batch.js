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

    privilages = httpRequest("../privilage?module=BATCH", "GET");
    employees = httpRequest("../employee/list", "GET");
    activesuppliers = httpRequest("../supplier/ActiveSup?status=1" , "GET");
    items = httpRequest("../item/list" , "GET");

    batchstatuses = httpRequest("../batchstatus/list" , "GET");
    batches = httpRequest("../batch/list" , "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2"; //d6d6c2
    updated = "2px solid #ff9900";
    active = "#ff9900";

    loadView();
    loadForm();

    changeTab('form');
}

//auto load require values to the form

function loadForm() {
    batch = new Object();
    oldbatch = null;

    fillCombo(cmbSupplier , "Select Suppier" , activesuppliers , "companyfullname", "");
    cmbSupplier.disabled = false;

    fillCombo(cmbStatus, "", batchstatuses, "name", "Active");
    batch.batchstatus_id = JSON.parse(cmbStatus.value);
    cmbStatus.disabled = true;

    //This date is not binding item just to show the date
    dtedate.value =  getCurrentTimeDate("date");
    dtedate.style.border = valid;
    dtedate.disabled = true;

    txtBatchNo.value = "";
    txtBatchNo.disabled = true;

    cmbItems.value = "";
    txtAvailableQTY.value = "";
    txtTotalQTY.value = "";
    txtReturnQTY.value = "";
    dteManufacture.value = "";
    txtPurchasePrice.value = "";
    txtSalePrice.value = "";

    setStyle(initial);
    cmbStatus.style.border = valid;

    disableButtons(false, true, true);
}

function cmbSupplierCH(){
    txtBatchNo.disabled = false;

    //filter items according to the selected supplier
    itemsbysupplier = httpRequest("/item/listBySupplier?supplierid="+JSON.parse(cmbSupplier.value).id , "GET");
    fillCombo(cmbItems , "Select Items" , itemsbysupplier , "itemname" , "" );

    cmbItems.style.border = initial;

}

//check if the user adding zero quantity to the batch
function checkzero() {
    if (txtTotalQTY.value == "0") {
        swal({
            title: "Quantity cannot be zero !!!",
            text: "\n",
            icon: "error",
            time: 1200,
            button: false,
            dangerMode: true,
        });

        txtTotalQTY.value = "";
        txtTotalQTY.style.border = invalid;

        return true;
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

//loading the table in batch page
function loadTable(page, size, query) {
    page = page - 1;
    batches = new Array();
    var data = httpRequest("/batch/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) batches = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblBatches', batches, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblBatches);

    if (activerowno != "") selectRow(tblBatches, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldbatch == null) {
        paginate = true;
    } else {
        if (getErrors() == '' && getUpdates() == '') {
            paginate = true;
        } else {
            paginate = window.confirm("Form has Some Errors or Update Values. " +
                "Are You Sure to Discard that Changes ?");
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
function viewitem(bt, rowno) {

    btch = JSON.parse(JSON.stringify(bt));

    tdBatchNo.innerHTML = btch.batchnumber;
    tdSupplier.innerHTML = btch.supplier_id.companyfullname;
    tdtxtItem.innerHTML = btch.item_id.itemname;
    tdTotal.innerHTML = btch.totalqty;
    tdAvailable.innerHTML = btch.availableqty;
    tdReturn.innerHTML = btch.returnqty;
    tdManufac.innerHTML = btch.manufacdate;
    tdExpire.innerHTML = btch.expiredate;
    tdPurchase.innerHTML = btch.purchaseprice;
    tdSale.innerHTML = btch.saleprice;
    tdStatus.innerHTML = btch.batchstatus_id.name;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    tdPrinted.innerHTML = date+' '+time;

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
        "<div class='col-md-12 ml-3 mt-2'><span style='text-align: left ; font-size: x-large ; font-weight: bold'>Batch Details</span></div>"+
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
    cmbItems.style.border = style;
    txtBatchNo.style.border = style;
    txtAvailableQTY.style.border = style;
    txtTotalQTY.style.border = style;
    txtReturnQTY.style.border = style;
    dteManufacture.style.border = style;
    txtPurchasePrice.style.border = style;
    txtSalePrice.style.border = style;

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
    for (index in batches) {
        if (batches[index].batchstatus_id.name == "Deleted") {
            tblBatches.children[1].children[index].style.color = "#f00";
            tblBatches.children[1].children[index].style.border = "2px solid red";
            tblBatches.children[1].children[index].lastChild.children[1].disabled = true;
            tblBatches.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (batch.supplier_id== null)
        errors = errors + "\n" + "Please Select a Supplier";
    else addvalue = 1;

    if (batch.batchnumber == null)
        errors = errors + "\n" + "Please Enter a Valid Batch No";
    else addvalue = 1;

    if (batch.item_id == null)
        errors = errors + "\n" + "Please Select an Item";
    else addvalue = 1;

    if (batch.totalqty == null)
        errors = errors + "\n" + "Please Enter Total Quantity of Items";
    else addvalue = 1;

    if (batch.availableqty == null)
        errors = errors + "\n" + "Please Enter Available Quantity of Items";
    else addvalue = 1;

    if (batch.returnqty == null)
        errors = errors + "\n" + "Please Enter Return Item Quantity";
    else addvalue = 1;

    if (batch.manufacdate == null)
        errors = errors + "\n" + "Please Select Manufacture Date";
    else addvalue = 1;

    if (batch.expiredate == null)
        errors = errors + "\n" + "Please Select Expire Date";
    else addvalue = 1;

    if (batch.purchaseprice == null)
        errors = errors + "\n" + "Please Enter Item Purchase Price";
    else addvalue = 1;

    if (batch.saleprice == null)
        errors = errors + "\n" + "Please Enter Item Sale Price";
    else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
            savedata();
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
        title: "Are you sure to place a quatation request ?",
        text: "\nSupplier : " + batch.supplier_id.companyfullname +
            "\nBatch No : " + batch.batchnumber +
            "\nItem : " + batch.item_id.itemname+
            "\nAvailable Qty : " + batch.availableqty +
            "\nTotal Qty : " + batch.totalqty +
            "\nReturn Qty : " + batch.returnqty +
            "\nExpire Date : " + batch.expiredate +
            "\nManufacture Date : " + batch.manufacdate +
            "\nPurchase Price : " + batch.purchaseprice +
            "\nSale Price : " + batch.saleprice ,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/batch", "POST", batch);
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
                changeTab('table');
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

    if (oldbatch == null && addvalue == "") {
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
function fillForm(btch, rowno) {
    activepage = rowno;

    if (oldbatch == null) {
        filldata(btch);
    } else {
        swal({
            title: "Form Has Some Values, Updates Values... Are You Sure To Discard The Form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(btch);
            }

        });
    }

}

//fill data to the form
function filldata(btch) {
    clearSelection(tblBatches);
    selectRow(tblBatches, activepage, active);

    batch = JSON.parse(JSON.stringify(btch));
    oldbatch = JSON.parse(JSON.stringify(btch));

    fillCombo(cmbSupplier , "" , activesuppliers , "companyfullname" , batch.supplier_id);
    cmbSupplier.disabled = "disabled";

    itemsbysupplier = httpRequest("/item/listBySupplier?supplierid="+JSON.parse(cmbSupplier.value).id , "GET");
    fillCombo(cmbItems , "" , itemsbysupplier , "itemname" , batch.item_id);

    txtBatchNo.value = batch.batchnumber;
    txtBatchNo.disabled = false;

    txtAvailableQTY.value = batch.availableqty;
    txtTotalQTY.value = batch.totalqty;
    txtReturnQTY.value = batch.returnqty;
    dteManufacture.value = batch.manufacdate;
    dteExpire.value = batch.expiredate;
    txtPurchasePrice.value = batch.purchaseprice;
    txtSalePrice.value = batch.saleprice;

    fillCombo(cmbStatus , "" , batchstatuses , "name" , batch.batchstatus_id.name);
    cmbStatus.disabled = false;

    disableButtons(true, false, false);
    setStyle(valid);

    changeTab('form');
}

function getUpdates() {

    var updates = "";

    if (batch != null && oldbatch != null) {

        if (batch.batchnumber != oldbatch.batchnumber)
            updates = updates + "\nBatch No is Changed";

        if (batch.item_id.itemname != oldbatch.item_id.itemname)
            updates = updates + "\nItem is Changed";

        if (batch.totalqty != oldbatch.totalqty)
            updates = updates + "\nTotal Quantity is Changed";

        if (batch.availableqty != oldbatch.availableqty)
            updates = updates + "\nAvailabale Quanatity is Changed";

        if (batch.returnqty != oldbatch.returnqty)
            updates = updates + "\nReturn Quantity is Changed";

        if (batch.expiredate != oldbatch.expiredate)
            updates = updates + "\nExpire Date is Changed";

        if (batch.manufacdate != oldbatch.manufacdate)
            updates = updates + "\nManufacture Date is Changed";

        if (batch.purchaseprice != oldbatch.purchaseprice)
            updates = updates + "\nPurchase Price is Changed";

        if (batch.saleprice != oldbatch.saleprice)
            updates = updates + "\nSale Price is Changed";

        if (batch.batchstatus_id.name != oldbatch.batchstatus_id.name)
            updates = updates + "\nBatch Status is Changed";

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
                title: "Are You Sure to Update Following Batch Details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/batch", "PUT", batch);
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

function btnDeleteMC(btch) {
    batch = JSON.parse(JSON.stringify(btch));

    swal({
        title: "Are You Sure to Delete Following Batch...?",
        text:"\n Supplier : " + batch.supplier_id.companyfullname +
            "\n Batch No : " + batch.batchnumber+
            "\n Item : " + batch.item_id.itemname+
            "\n Available Quantity : " + batch.availableqty+
            "\n Expire Date : " + batch.expiredate+
            "\n Purchase Price : " + batch.purchaseprice+
            "\n Sale Price : " + batch.saleprice,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/batch", "DELETE", batch);
            if (responce == 0) {
                swal({
                    title: "Deleted Successfully....!",
                    text: "\n\n  Status Changed to Delete",
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
    formattab = tblBatches.outerHTML;

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
        "<div class='col-md-12 ml-3 mt-2'><span style='text-align: left ; font-size: x-large ; font-weight: bold'>Batch Details</span></div>"+
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

    var cprop = tblBatches.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        batches.sort(
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
        batches.sort(
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
    fillTable('tblBatches', batches, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblBatches);
    loadForm();

    if (activerowno != "") selectRow(tblBatches, activerowno, active);


}