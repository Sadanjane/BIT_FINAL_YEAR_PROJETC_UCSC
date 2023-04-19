package com.OMEL.repository;

import com.OMEL.model.POrderHasItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PorderHasItemRepository extends JpaRepository<POrderHasItem, Integer> {

    @Query("SELECT p from POrderHasItem p where p.item_id.id=:itemid and p.porder_id.id=:porder")
    POrderHasItem porderbyItem(@Param("itemid") Integer itemid , @Param("porder") Integer porder);


}
