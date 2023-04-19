package com.OMEL.repository;

import com.OMEL.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Integer> {


    @Query("SELECT b from Batch b where b.supplier_id.id =:supplierid and b.item_id.id=:itemid ")
    List<Batch>listBySupplierItem(@Param("supplierid")Integer supplierid , @Param("itemid") Integer itemid);

    @Query("select b from Batch b where b.supplier_id.companyfullname like concat('%' , :searchtext , '%')or " +
            "b.batchnumber like concat('%' , :searchtext  ,'%')or "+
            "b.batchstatus_id.name like concat('%' , :searchtext  ,'%')or "+
            "concat(b.totalqty,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(b.availableqty,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(b.returnqty,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(b.expiredate,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(b.manufacdate,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(b.purchaseprice,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(b.saleprice,'') like concat('%' , :searchtext  ,'%') ")
    Page<Batch> findAll(@Param("searchtext")String searchtext , Pageable of);

    /*in grn when typing batc code it checks it whether exists or not*/
    @Query("select b from Batch b where b.item_id.id=:itemid and b.batchnumber=:batchcode")
    Batch listByItemBatchcode(@Param("itemid")Integer itemid, @Param("batchcode")String batchcode);

    //this query is for inventory
    @Query("select new Batch (b.item_id ,sum(b.availableqty),sum(b.totalqty),sum(b.returnqty) ) from Batch b where " +
            "(b.item_id.itemname like concat('%' , :searchtext  ,'%') or "+
            "b.item_id.itemcode like concat('%' , :searchtext  ,'%')) group by b.item_id.id ")
    Page<Batch> itemfindAll(@Param("searchtext")String searchtext , Pageable of);

    //this query is for mainwindow low inventory table
    @Query("select new Batch (b.item_id ,sum(b.availableqty), b.supplier_id) from Batch b " +
            " group by b.item_id.id")
    List<Batch> itemFindAllLowInventory();

    @Query("select new Batch(b.id , b.item_id , b.batchnumber, b.availableqty , b.discountratio , b.saleprice) from Batch b where b.batchstatus_id.id = 1 and b.item_id.itemname=:itemname and b.availableqty > 0 order by (b.expiredate)desc ")
    List<Batch>batchList(@Param("itemname")String itemname);

    @Query("Select new Batch(b.id ,  b.saleprice , b.purchaseprice , b.availableqty , b.batchnumber , b.item_id , b.discountratio) from Batch b where b.batchnumber=:batchno and b.availableqty > 0 order by (b.expiredate)desc ")
    Batch batchListfrombatch(@Param("batchno")String batchno);

    /*this query is for customer order*/
    @Query("select new Batch(b.id , b.item_id , b.availableqty , b.discountratio , b.saleprice) from Batch b where b.batchstatus_id.id = 1 and b.item_id.itemname=:itemname and b.availableqty > 0 order by b.availableqty DESC ")
    List<Batch>batchListCO(@Param("itemname")String itemname);

    @Query("Select b from Batch b where b.supplier_id.id=:supplierid and b.item_id.id=:itemid and b.batchnumber=:batchnumber")
    Batch getBySupplierItemBatchno(@Param("supplierid")Integer supplierid, @Param("itemid") Integer itemid, @Param("batchnumber") String batchnumber);

    @Query("Select b from Batch b where b.item_id.id=:itemid and b.batchnumber=:batchnumber")
    Batch getByItemBatchno(@Param("itemid") Integer itemid, @Param("batchnumber") String batchnumber);

}


//new Batch(b.id , b.saleprice , b.purchaseprice ,b.totalqty , b.availableqty)