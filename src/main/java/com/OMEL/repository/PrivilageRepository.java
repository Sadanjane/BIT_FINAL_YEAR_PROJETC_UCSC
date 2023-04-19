package com.OMEL.repository;

import com.OMEL.model.Module;
import com.OMEL.model.Privilage;
import com.OMEL.model.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PrivilageRepository extends JpaRepository<Privilage, Integer> {
    // Query for get privilage for given Module and User
    @Query(value ="select bit_or(sel) sel, bit_or(ins) ins, bit_or(upd) upd, bit_or(del) del from omelstore.privilage where roles_role_id in (select role_id from omelstore.user_role where user_id=(select user_id from omelstore.users where user_name = ?1)) and module_id=(select id from omelstore.module where name= ?2);", nativeQuery = true )
    String findByUserModle(String username, String modulename);

    @Query("SELECT p FROM Privilage p WHERE p.roleId= :role AND p.moduleId= :module")
    Privilage findByRoleModule(@Param("role") Role role, @Param("module") Module module);

    @Query("SELECT p FROM Privilage p where (p.roleId.role like concat('%',:searchtext,'%') or p.moduleId.name like concat('%',:searchtext,'%') ) and p.roleId.role<>'Admin' ")
    Page<Privilage> findAll(@Param("searchtext") String searchtext , Pageable of);


}
