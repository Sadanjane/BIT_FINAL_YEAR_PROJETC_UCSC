package com.OMEL.repository;

import com.OMEL.model.RoyaltyPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface RoyaltyPointRepository extends JpaRepository<RoyaltyPoint, Integer> {

    @Query("select r from RoyaltyPoint r where :points between  r.startrange and  r.stoprange")
    RoyaltyPoint byPoints(@Param("points")BigDecimal points);

}


//new Batch(b.id , b.saleprice , b.purchaseprice ,b.totalqty , b.availableqty)