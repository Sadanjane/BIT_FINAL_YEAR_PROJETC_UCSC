package com.OMEL.repository;

import com.OMEL.model.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubCategoryRepository extends JpaRepository<SubCategory, Integer> {

    @Query("select sc from SubCategory sc where sc.category_id.id = :category_id")
    List<SubCategory>ListByCategory(@Param("category_id") Integer category_id);

}
