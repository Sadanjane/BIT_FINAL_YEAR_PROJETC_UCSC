package com.OMEL.repository;

import com.OMEL.model.BrandHasCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandHasCategoryRepository extends JpaRepository<BrandHasCategory, Integer> {

    /*@Query("SELECT qhi from QuatationHasItem qhi where qhi.id in ((select qh.quatation_id.id from QuatationHasItem qh where qh.quatation_id.id=:quatattionid) and (select qh2.item_id.id from QuatationHasItem qh2 where qh2.item_id.id=:itemid)) ")
    List<QuatationHasItem> listByQuataionandItem1 (@Param("quatationid") Integer quataionid , @Param("itemid")Integer itemid);*/

    /*@Query("SELECT qhi from QuatationHasItem qhi where qhi.quatation_id.id =:quatationid and qhi.item_id.id=:itemid ")
    List<QuatationHasItem> listByQuatationItem (@Param("quatationid")Integer quatationid , @Param("itemid") Integer itemid);*/


}
