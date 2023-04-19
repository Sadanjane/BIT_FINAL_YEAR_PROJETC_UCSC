package com.OMEL.model;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "customerorder")

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "ordercode")
    private String ordercode;

    @Basic(optional = false)
    @Column(name = "requireddate")
    private LocalDate requireddate;

    @Basic(optional = false)
    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @Basic(optional = false)
    @Column(name = "discountrate")
    private BigDecimal discountrate;

    @Basic(optional = false)
    @Column(name = "lastprice")
    private BigDecimal lastprice;

    @Basic(optional = true)
    @Column(name = "description")
    private String description;

    @Basic(optional = true)
    @Column(name = "addeddate")
    private LocalDate addeddate;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "customer_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Customer customer_id;

    @JoinColumn(name = "customerorderstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private CustomerOrderStatus customerorderstatus_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "customerorder_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<CustomerOrderHasItem> orderHasItemList;

    public CustomerOrder(String ordercode){
        this.ordercode = ordercode;
    }

    //this method for invoice selecting customer order
    public CustomerOrder(Integer id , String ordercode , LocalDate requireddate){
        this.id = id;
        this.ordercode = ordercode;
        this.requireddate = requireddate;
    }


}
