package com.OMEL.repository;

import com.OMEL.model.CustomerOrder;
import com.OMEL.model.GRN;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Integer> {

    @Query(value = "SELECT concat('OMEL' , lpad(substring(max(c.ordercode) , 5) +1 , 6 , '0' )) from omelstore.customerorder as c" , nativeQuery = true)
    String getNextOrderNo();

    @Query("select c from CustomerOrder c where c.ordercode like concat('%' , :searchtext , '%')or " +
            "c.customer_id.fname like concat('%' , :searchtext  ,'%')or "+
            "concat(c.requireddate,'')like concat('%' , :searchtext  ,'%')or "+
            "concat(c.totalamount, '')  like concat('%' , :searchtext  ,'%')or "+
            "concat( c.lastprice , '') like concat('%' , :searchtext  ,'%')or "+
            "c.customerorderstatus_id.name like concat('%' , :searchtext , '%')")
    Page<CustomerOrder> findAll(@Param("searchtext")String searchtext , Pageable of);

    @Query(value = "SELECT new CustomerOrder (co.id , co.ordercode , co.requireddate) from CustomerOrder co where co.customerorderstatus_id.id = 1")
    List<CustomerOrder> corderList(@Param("customerid") Integer customerid);
}
