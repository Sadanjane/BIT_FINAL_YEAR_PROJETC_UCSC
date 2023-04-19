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

    //dteDOBirth.onchange = dteDOBirthCH;
    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=INVENTORY", "GET");
    employees = httpRequest("../employee/list", "GET");

    batchstatuses = httpRequest("../batchstatus/list" , "GET");

    inventoryies = httpRequest("../batch/list" , "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2"; //d6d6c2
    updated = "2px solid #ff9900";
    active = "#ff9900";

    loadView();
}

function LoadForm(){

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

//loading the table in inventory page
function loadTable(page, size, query) {
    page = page - 1;
    inventoryies = new Array();
    var data = httpRequest("/batch/itemfindAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) inventoryies = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    for(var index in inventoryies){
        if(inventoryies[index].item_id.rop <  inventoryies[index].availableqty){
            inventoryies[index].batchstatus_id = batchstatuses[0];
        }
        if(inventoryies[index].item_id.rop >=  inventoryies[index].availableqty){
            inventoryies[index].batchstatus_id = batchstatuses[3];
        }
        if(  inventoryies[index].availableqty == 0){
            inventoryies[index].batchstatus_id = batchstatuses[1];
        }
    }

    fillTable('tblInventory', inventoryies, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblInventory);

    if (activerowno != "") selectRow(tblInventory, activerowno, active);

    disableButtons(true,true,true);

}

function fillForm(gr, rowno) {
}

function btnDeleteMC(sup) {
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
function viewitem(sup, rowno) {

    supplier = JSON.parse(JSON.stringify(sup));

    tdregNo.innerHTML = supplier.regno;
    tdComName.innerHTML = supplier.companyfullname;
    tdContact.innerHTML = supplier.landno;
    tdEmail.innerHTML = supplier.email;
    tdAddress.innerHTML = supplier.address;
    tdComReg.innerHTML = supplier.companyregno;
    tdSupCol.innerHTML = supplier.suppliercol;
    tdCPName.innerHTML = supplier.cpname;
    tdCPContact.innerHTML = supplier.cpmobile;
    tdBankNo.innerHTML = supplier.bankaccno;
    tdBankAccName.innerHTML = supplier.bankaccname;
    tdBankName.innerHTML = supplier.bankname;
    tdBranch.innerHTML = supplier.bankbranchname;
    tdCredit.innerHTML = supplier.creditlimit;
    tdAreas.innerHTML = supplier.areasamount;
    tdDescription.innerHTML = supplier.description;
    tdAddedBy.innerHTML = supplier.employee_id.callingname;
    tdStatus.innerHTML = supplier.supplierstatus_id.name;
    tdAdded.innerHTML = supplier.addeddate;

    //fillInnerTable("tblPrintInnerItem" , supplier.supplierHasItemList , innerModify , innerDelete, innerView);

    $('#dataViewModel').modal('show')

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

function disableButtons(add, upd, del) {


    // select deleted data row
    for (var index in inventoryies) {
        tblInventory.children[1].children[index].lastChild.children[0].style.display = "none";
        tblInventory.children[1].children[index].lastChild.children[1].style.display = "none";

        if(inventoryies[index].batchstatus_id == batchstatuses[0]){
            tblInventory.children[1].children[index].style.backgroundColor = ""; //available
        }
        if(inventoryies[index].batchstatus_id == batchstatuses[3]){
            tblInventory.children[1].children[index].style.backgroundColor = "orange"; //low inventory
        }
        if( inventoryies[index].batchstatus_id == batchstatuses[1]){
            tblInventory.children[1].children[index].style.backgroundColor = "red"; //not available
        }

    }

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