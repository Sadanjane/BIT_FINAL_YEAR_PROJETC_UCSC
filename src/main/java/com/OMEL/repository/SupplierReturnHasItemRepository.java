package com.OMEL.repository;

import com.OMEL.model.POrderHasItem;
import com.OMEL.model.SupplierReturnHasItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SupplierReturnHasItemRepository extends JpaRepository<SupplierReturnHasItem, Integer> {

    @Query("SELECT sr from SupplierReturnHasItem sr where sr.item_id.id=:itemid and sr.supplierreturn_id.id=:returnid")
    SupplierReturnHasItem supretbyitemreturn(@Param("itemid") Integer itemid , @Param("returnid") Integer returnid);


}
