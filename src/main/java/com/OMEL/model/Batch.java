package com.OMEL.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "batch")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "batchnumber")
    private String batchnumber;

    @Basic(optional = false)
    @Column(name = "availableqty")
    private BigDecimal availableqty;

    @Basic(optional = false)
    @Column(name = "totalqty")
    private BigDecimal totalqty;

    @Basic(optional = false)
    @Column(name = "returnqty")
    private BigDecimal returnqty;

    @Basic(optional = false)
    @Column(name = "expiredate")
    private LocalDate expiredate;

    @Basic(optional = false)
    @Column(name = "manufacdate")
    private LocalDate manufacdate;

    @Basic(optional = false)
    @Column(name = "saleprice")
    private BigDecimal saleprice;

    @Basic(optional = false)
    @Column(name = "purchaseprice")
    private BigDecimal purchaseprice;

    @Basic(optional = false)
    @Column(name = "discountratio")
    private BigDecimal discountratio;

    @JoinColumn(name = "batchstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private BatchStatus batchstatus_id;

    @JoinColumn(name = "item_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Item item_id;

    @JoinColumn(name = "supplier_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Supplier supplier_id;

    public Batch(Integer id , Item item_id  , String batchnumber , BigDecimal availableqty  , BigDecimal discountratio ,BigDecimal saleprice){
        this.id = id;
        this.item_id = item_id;
        this.batchnumber = batchnumber;
        this.availableqty = availableqty;
        this.discountratio = discountratio;
        this.saleprice = saleprice;
    }

    //for customer order module
    public Batch(Integer id , Item item_id  , BigDecimal availableqty  , BigDecimal discountratio ,BigDecimal saleprice){
        this.id = id;
        this.item_id = item_id;
        this.availableqty = availableqty;
        this.discountratio = discountratio;
        this.saleprice = saleprice;
    }

    public Batch(Integer id ,BigDecimal saleprice , BigDecimal purchaseprice , BigDecimal availableqty , String batchnumber  , Item item_id , BigDecimal discountratio){
        this.id = id;
        this.saleprice = saleprice;
        this.purchaseprice = purchaseprice;
        this.availableqty = availableqty;
        this.batchnumber = batchnumber;
        this.item_id = item_id;
        this.discountratio = discountratio;
    }

    public Batch(Item item_id , BigDecimal availableqty , BigDecimal totalqty , BigDecimal returnqty ){
        this.item_id = item_id;
        this.availableqty = availableqty;
        this.totalqty = totalqty;
        this.returnqty = returnqty;
    }

    /*this is for itemFindAllLowInventory function in mainwindows lowinventory table*/
    public Batch (Item item_id , BigDecimal availableqty , Supplier supplier_id){
        this.item_id = item_id;
        this.availableqty =  availableqty;
        this.supplier_id = supplier_id;
    }

    /*this is for checking whether exists the typing batch number or not in GRN*/
    public Batch (Integer id , String batchnumber){
        this.id = id;
        this.batchnumber = batchnumber;
    }



}
