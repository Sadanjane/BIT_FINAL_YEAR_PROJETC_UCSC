window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {

    //tooltip
    $('[data-toggle="tooltip"]').tooltip();

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    //when change the Unit tyepe auto complete Item Name
    cmbUits.addEventListener("change" , cmbUitsCH );

    //dteDOBirth.onchange = dteDOBirthCH;
    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=ITEM", "GET");

    employees = httpRequest("../employee/list", "GET");
    brands = httpRequest("../brand/list" , "GET");
    itmstatuses = httpRequest("../itemstatus/list" , "GET");
    categories = httpRequest("../category/list" , "GET");
    subcategories = httpRequest("../subcategory/list" , "GET");
    units = httpRequest("../unit/list" , "GET");
    unitytypes = httpRequest("../unitytype/list" , "GET");
    items = httpRequest("../item/list" , "GET");
    itemstatuses = httpRequest("itemstatus/list" , "GET");


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
    item = new Object();
    olditem = null;

    fillCombo(cmbCategory, "Select Category", categories, "name", "");
    fillCombo(cmbSubCategory , "Select Sub Category" , '' , "name" , "");
    fillCombo(cmbBrand, "Select Brand", '', "name", "");
    fillCombo3(cmbUits , "Select Units" , units , "name" ,"unitytype_id.name" , "" );

    //fill data and auto bind
    fillCombo(cmbStatus, "", itmstatuses , "name", "Available");
    fillCombo(txtEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    item.itemstatus_id = JSON.parse(cmbStatus.value);
    cmbStatus.disabled = true;

    item.employee_id = JSON.parse(txtEmployee.value);
    txtEmployee.disabled = true;

    var today = new Date();
    var month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = today.getDate();
    if (date < 10) date = "0" + date;

    dteDate.value = today.getFullYear() + "-" + month + "-" + date;
    item.addeddate = dteDate.value;
    dteDate.disabled = true;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/item/nextnumber", "GET");
    txtItemCode.value = nextNumber.itemcode;
    item.itemcode = txtItemCode.value;
    txtItemCode.disabled = "disabled";

    filePhoto.value = "";
    imgViewPhoto.src = "";
    imgViewPhoto.style.display = "none";

    txtItemName.value = "";
    txtRop.value = "";
    txtRoq.value = "";
    txtDescription.value = "";
    // removeFile('flePhoto');

    setStyle(initial);
    dteDate.style.border = valid;
    txtEmployee.style.border = valid;
    cmbStatus.style.border = valid;
    txtItemCode.style.border = valid;

    disableButtons(false, true, true);
}

//set styles to the form

function setStyle(style) {

    txtItemName.style.border = style;
    txtRop.style.border = style;
    txtRoq.style.border = style;
    txtDescription.style.border = style;

    cmbCategory.style.border = style;
    cmbSubCategory.style.border = style;
    cmbBrand.style.border = style;
    cmbUits.style.border = style;
    dteDate.style.border = style;
    cmbStatus.style.border = style;

}

//function for auto complete Item name (Item name = brand name + subcategory + unit + unittype)
function cmbUitsCH(){
    /*txtItemName.value = item.brand_id.name + " " + item.subcategory_id.name + " " + item.unit_id.name + " " + item.unit_id.unitytype_id.name;
    item.itemname = txtItemName.value;
    txtItemName.style.border = valid;*/

    if(item.brand_id != null && item.subcategory_id != null && item.subcategory_id.category_id != null && item.unit_id != null && item.unit_id.unitytype_id != null){

        txtItemName.value = item.brand_id.name + " " + item.subcategory_id.name + " " + item.unit_id.name + " " + item.unit_id.unitytype_id.name;
        if(olditem != null && item.itemname != olditem.itemname){
            item.itemname = txtItemName.value;
            txtItemName.style.border = updated;
        }else{
            item.itemname = txtItemName.value;
            txtItemName.style.border = valid;
        }
    }
}

//function for request right subcategory when select the category
function cmbCategoryCH() {

    cmbSubCategory.value = "";
    cmbSubCategory.style.border = initial;
    cmbBrand.value = "";
    cmbBrand.style.border = initial;
    cmbUits.value = "";
    cmbUits.style.border = initial;

    subcategoriesbyid = httpRequest("/subcategory/listByCategory?category_id="+JSON.parse(cmbCategory.value).id , "GET");
    fillCombo(cmbSubCategory, "Select Sub Category", subcategoriesbyid, "name", "");

    brandsbyid = httpRequest("/brand/listByCat?categoryid="+ JSON.parse(cmbCategory.value).id , "GET");
    fillCombo(cmbBrand , "Select Brand" , brandsbyid , "name" , "");

    if (olditem != null && olditem.subcategory_id.category_id.name != JSON.parse(cmbCategory.value).name) {
        cmbCategory.style.border = updated;
    } else {
        cmbCategory.style.border = valid;
    }
}

function subcategoryCH(){
    if (olditem != null && olditem.subcategory_id.name != JSON.parse(cmbSubCategory.value).name) {
        cmbSubCategory.style.border = updated;
    } else {
        cmbSubCategory.style.border = valid;
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

//loading the table in Item page
function loadTable(page, size, query) {
    page = page - 1;
    items = new Array();
    var data = httpRequest("/item/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) items = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblItems', items, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblItems);

    if (activerowno != "") selectRow(tblItems, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (olditem == null) {
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

    tdItemNo.innerHTML = printitem.itemcode;
    tdItemName.innerHTML = printitem.itemname;
    tdRop.innerHTML = printitem.rop;
    tdRoq.innerHTML = printitem.roq;
    tdCategory.innerHTML = printitem.subcategory_id.category_id.name;
    tdSubCategory.innerHTML = printitem.subcategory_id.name;
    tdBrand.innerHTML = printitem.brand_id.name;
    tdUnits.innerHTML = volume;
    tdAdded.innerHTML = printitem.addeddate;
    tdStatus.innerHTML = printitem.itemstatus_id.name;
    tdAddedBy.innerHTML = printitem.employee_id.callingname;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    tdPrinted.innerHTML = date+' '+time;

    if(printitem.description == null){
        tdDescription.innerHTML = "-";
    }else{
        tdDescription.innerHTML = printitem.description;
    }

    //image update to the form
    if(printitem.photo !=null){
        tdItemImage.src = atob(printitem.photo);
    }else{
        tdItemImage.src = 'resources/image/noimage.png';
        tdItemImage.style.display = "block";
    }

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
        "<div class='col-md-12 ml-3 mt-2'><span style='text-align: left ; font-size: x-large ; font-weight: bold'>ITEM Details</span></div>"+
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
    for (index in items) {
        if (items[index].itemstatus_id.name == "Deleted") {
            tblItems.children[1].children[index].style.color = "#f00";
            tblItems.children[1].children[index].style.border = "2px solid red";
            tblItems.children[1].children[index].lastChild.children[1].disabled = true;
            tblItems.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}



function getErrors() {

    var errors = "";
    addvalue = "";

    if (cmbCategory.value == "")
        errors = errors + "\n" + "Please select item category";
    else addvalue = 1;

    if (item.subcategory_id == null)
        errors = errors + "\n" + "Please select item sub category";
    else addvalue = 1;

    if (item.brand_id == null)
        errors = errors + "\n" + "Please select item brand";
    else addvalue = 1;

    if (item.unit_id == null)
        errors = errors + "\n" + "Please select item units";
    else addvalue = 1;

    if (item.itemname == null)
        errors = errors + "\n" + "Item Name is not valid  Please Select these options in this order (Category , SubCategory , Brand , Unit)";
    else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtRop.value == "" || txtRoq.value == "" || txtDescription.value == "") {
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
        title: "Are you sure to add following item...?",
        text: "\nItem Code : " + item.itemcode +
            "\nItem Name : " + item.itemname +
            "\nSubCategory: " + item.subcategory_id.name +
            "\nCategory : " + item.subcategory_id.category_id.name +
            "\nBrand: " + item.brand_id.name +
            "\nUnits : " + item.unit_id.name + " " + item.unit_id.unitytype_id.name +
            "\nROP : " + item.rop +
            "\nROQ : " + item.roq +
            "\nDescription : " + item.description +
            "\nAdded Date : " + item.addeddate +
            "\nItem Status : " + item.itemstatus_id.name +
            "\nAdded By  : " + item.employee_id.callingname,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/item", "POST", item);
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

    if (olditem == null && addvalue == "") {
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
function fillForm(itm, rowno) {
    activepage = rowno;

    if (olditem == null) {
        filldata(itm);
        $('#maintable').modal('show');
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(itm);
            }
            $('#maintable').modal('show');
        });
    }

}

//fill data to the form
function filldata(itm) {
    clearSelection(tblItems);
    selectRow(tblItems, activepage, active);

    item = JSON.parse(JSON.stringify(itm));
    olditem = JSON.parse(JSON.stringify(itm));

    txtItemCode.value = item.itemcode;
    txtItemCode.disabled = "disabled";
    txtItemName.value = item.itemname;

    fillCombo(cmbCategory , "" , categories , "name" , item.subcategory_id.category_id.name);

    subcategoriesbyid = httpRequest("/subcategory/listByCategory?category_id="+JSON.parse(cmbCategory.value).id , "GET");
    fillCombo(cmbSubCategory, "", subcategoriesbyid, "name", item.subcategory_id.name);

    brandsbyid = httpRequest("/brand/listByCat?categoryid="+ JSON.parse(cmbCategory.value).id , "GET");
    fillCombo(cmbBrand , "" , brandsbyid , "name" , item.brand_id.name);

    fillCombo3(cmbUits , "" , units , "name" , "unitytype_id.name" ,item.unit_id.name);

    txtDescription.value = item.description;
    txtRop.value = item.rop;
    txtRoq.value = item.roq;

    dteDate.value = item.addeddate;
    dteDate.disabled = "disabled" ;

    fillCombo(cmbStatus , "" , itemstatuses , "name" , item.itemstatus_id.name);
    cmbStatus.disabled = false;
    fillCombo(txtEmployee , "" , employees , "callingname" , item.employee_id.callingname);
    txtEmployee.disabled = "disabled";

    //image update to the form
    if(item.photo !=null)imgViewPhoto.src = atob(item.photo);else imgViewPhoto.src = 'resources/image/noimage.png';
    imgViewPhoto.style.display = "block";

    disableButtons(true, false, false);
    setStyle(valid);
    $('#maintable').modal('hide');

    //OPTIONAL FIELDS
    if(item.description == null)
        txtDescription.style.border = initial;
    if(item.rop == null)
        txtRop.style.border = initial;
    if(item.roq == null)
        txtRoq.style.border= initial;
}

function getUpdates() {

    var updates = "";

    if (item != null && olditem != null) {

        if (item.itemname != olditem.itemname)
            updates = updates + "\nItem Name is Changed";

        if (item.subcategory_id.category_id.name != olditem.subcategory_id.category_id.name)
            updates = updates + "\nCategory is Changed";

        if (item.subcategory_id.name != olditem.subcategory_id.name)
            updates = updates + "\nSubCategory is Changed";

        if (item.brand_id.name != olditem.brand_id.name)
            updates = updates + "\nBrand is Changed";

        if (item.unit_id.name != olditem.unit_id.name)
            updates = updates + "\nUnit is Changed";

        if (item.rop != olditem.rop)
            updates = updates + "\nROP is Changed";

        if (item.roq != olditem.roq)
            updates = updates + "\nROQ is Changed";

        if (item.description != olditem.description)
            updates = updates + "\nDescription is Changed";

        if (item.itemstatus_id.name != olditem.itemstatus_id.name )
            updates = updates + "\nItem Status is Changed";
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
                title: "Are you sure to update following Customer details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/item", "PUT", item);
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
                            $('#maintable').modal('show');

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

function btnDeleteMC(itm) {
    item = JSON.parse(JSON.stringify(itm));

    swal({
        title: "Are you sure to delete following Item...?",
        text: "\n Item Code : " + item.itemcode +
            "\n Item Name : " + item.itemname +
            "\n Item Added Date : " + item.addeddate+
            "\n Item Added By : " + item.employee_id.callingname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/item", "DELETE", item);
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
    formattab = tblItems.outerHTML;

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
    fillTable('tblItems', items, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblItems);
    loadForm();

    if (activerowno != "") selectRow(tblEmployee, activerowno, active);


}