package com.OMEL.repository;

import com.OMEL.model.QuatationHasItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuatationHasItemRepository extends JpaRepository<QuatationHasItem, Integer> {

    /*@Query("SELECT qhi from QuatationHasItem qhi where qhi.id in ((select qh.quatation_id.id from QuatationHasItem qh where qh.quatation_id.id=:quatattionid) and (select qh2.item_id.id from QuatationHasItem qh2 where qh2.item_id.id=:itemid)) ")
    List<QuatationHasItem> listByQuataionandItem1 (@Param("quatationid") Integer quataionid , @Param("itemid")Integer itemid);*/

    @Query("SELECT qhi from QuatationHasItem qhi where qhi.quatation_id.id =:quatationid and qhi.item_id.id=:itemid ")
    QuatationHasItem listByQuatationItem (@Param("quatationid")Integer quatationid , @Param("itemid") Integer itemid);

    /*@Query("SELECT qhi from QuatationHasItem qhi where qhi.quatation_id.id =:quatationid ")
    List<QuatationHasItem> listByQuatation (@Param("quatationid")Integer quatationid);*/
}
