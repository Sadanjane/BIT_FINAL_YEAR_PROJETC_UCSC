package com.OMEL.repository;

import com.OMEL.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IncomeReportRepository extends JpaRepository<Supplier , Integer> {

    @Query(value = "SELECT new Supplier(s.companyfullname , s.areasamount) FROM Supplier s ")
    List<Supplier> areusAmountFindAll();

}
