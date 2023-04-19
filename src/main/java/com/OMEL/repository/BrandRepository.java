package com.OMEL.repository;

import com.OMEL.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BrandRepository extends JpaRepository<Brand, Integer> {

    @Query("SELECT b from Brand b where b.id in (select st.brand_id.id from BrandHasCategory st where st.category_id.id=:categoryid)")
    List<Brand> listByCategory(@Param("categoryid") Integer categoryid);

}
