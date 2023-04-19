package com.OMEL.repository;

import com.OMEL.model.Customer;
import com.OMEL.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    @Query("select c from Customer c where c.fname like concat('%' , :searchtext , '%')or " +
            "c.lname like concat('%' , :searchtext  ,'%')or "+
            "c.fname like concat('%' , :searchtext , '%')or " +
            "c.email like concat('%' , :searchtext , '%')or "+
            "c.customerstatus_id1.name like concat('%' , :searchtext , '%') or " +
            "concat( c.regno, '') like concat('%' , :searchtext  ,'%')or " +
            "concat( c.mobileno, '') like concat('%' , :searchtext  ,'%')")
    Page<Customer>findAll(@Param("searchtext")String searchtext , Pageable of);

    @Query(value = "select concat(left(SYSDATE() , 4) , lpad(substring(max(c.regno) , 5) +1 , 6 , '0')) from omelstore.customer as c" , nativeQuery = true)
    String getNextNumber();

    @Query("select new Customer(c.id , c.fname , c.lname , c.mobileno , c.points) from Customer c where c.customerstatus_id1=1")
    List<Customer>activeCus();

    @Query("SELECT c FROM Customer c WHERE c.nic= :nic")
    Customer findByNIC(@Param("nic") String nic);

    @Query("SELECT c FROM Customer c WHERE c.mobileno= :mobileno")
    Customer findByMOBILE(@Param("mobileno") String mobileno);

   /* @Query();
    Customer getByNic(@Param("nic") String itemid);*/
}
