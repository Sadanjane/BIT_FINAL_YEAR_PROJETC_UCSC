package com.OMEL.repository;

import com.OMEL.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Integer> {

    @Query("select i from Item i where i.itemcode like concat('%' , :searchtext , '%')or " +
            "i.itemname like concat('%' , :searchtext  ,'%') or " +
            "concat(i.rop,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(i.roq,'') like concat('%' , :searchtext  ,'%') or " +
            "i.subcategory_id.category_id.name like concat('%' , :searchtext , '%') or " +
            "i.subcategory_id.name like concat('%' , :searchtext  ,'%') or " +
            "i.brand_id.name like concat('%' , :searchtext  ,'%') or " +
            "i.itemstatus_id.name like concat('%' , :searchtext  ,'%')")
    Page<Item>findAll(@Param("searchtext")String searchtext , Pageable of);

    //get item code automatically from the database
    @Query(value = "SELECT concat('ITM' , lpad(substring(max(i.itemcode) , 4) + 1 , 4 , '0')) from omelstore.item as i;" , nativeQuery = true)
    String getNextNumber();
    /*this query is for grn type retun only*/
    @Query("select new Item (i.id , i.itemcode , i.itemname) from Item i where i.id in (select sti.item_id.id from SupplierReturnHasItem sti where sti.supplierreturn_id.id=:returnid) group by i.itemname")
    List <Item>listByReturn( @Param("returnid")Integer returnid);

/*this is for grn type porder with retrun item*/
    @Query("select new Item (i.id , i.itemcode , i.itemname) from Item i where i.id in (select po.item_id.id from POrderHasItem po where po.porder_id.id=:porderid) or i.id in (select sti.item_id.id from SupplierReturnHasItem sti where sti.supplierreturn_id.id=:returnid) group by i.itemname")
    List <Item>listByPorderReturn(@Param("porderid")Integer porderid , @Param("returnid")Integer returnid);

    //Query for get Item Id , ItemCode , ItemName
    @Query("select new Item (i.id , i.itemcode , i.itemname) from Item i where i.itemstatus_id.name = 'Available' group by i.itemname")
    List<Item> list();

    @Query("SELECT i from Item i where i.id in (select qt.item_id.id from QuatationHasItem qt where qt.quatation_id.id=:quatationid)")
    List<Item>listByQuatation(@Param("quatationid") Integer quatationid);

    @Query("SELECT i from Item i where i.id in (select st.item_id.id from SupplierHasItem st where st.supplier_id.id=:supplierid) order by i.addeddate asc ")
    List<Item> ListBySupplier(@Param("supplierid") Integer supplierid);

    @Query("SELECT i from Item i where i.id in (select p.item_id.id from POrderHasItem p where p.porder_id.id=:porderid)")
    List<Item>listByPorder(@Param("porderid") Integer porderid);

    /*?1 walin ganne getByName kiyna constructorge palaweni parameter eka*/
    @Query("select new Item (i.id , i.itemcode , i.itemname) from Item i where i.itemname=?1")
    Item getByName(String itemname);

    @Query("select new Item (i.id , i.itemcode) from Item as i where i.itemcode=?1")
    Item getByItemCode(String itemcode);
}
