package com.OMEL.repository;

import com.OMEL.model.SupplierHasItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierHasItemRepository extends JpaRepository<SupplierHasItem, Integer> {

    /*@Query("SELECT qhi from QuatationHasItem qhi where qhi.id in ((select qh.quatation_id.id from QuatationHasItem qh where qh.quatation_id.id=:quatattionid) and (select qh2.item_id.id from QuatationHasItem qh2 where qh2.item_id.id=:itemid)) ")
    List<QuatationHasItem> listByQuataionandItem1 (@Param("quatationid") Integer quataionid , @Param("itemid")Integer itemid);*/

    @Query("SELECT shi from SupplierHasItem shi where shi.supplier_id.id =:supplierid ")
    List<SupplierHasItem> listBySupplierItem (@Param("supplierid")Integer supplierid );

}
