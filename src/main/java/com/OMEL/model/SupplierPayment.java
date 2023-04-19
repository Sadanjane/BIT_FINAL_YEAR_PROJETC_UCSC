package com.OMEL.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "supplierpayment")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "billno")
    private String billno;

    @Basic(optional = true)
    @Column(name = "description")
    private String description;

    @Basic(optional = false)
    @Column(name = "addeddate")
    private LocalDate addeddate;

    @Basic(optional = false)
    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @Basic(optional = true)
    @Column(name = "grnamount")
    private BigDecimal grnamount;

    @Basic(optional = false)
    @Column(name = "paidamount")
    private BigDecimal paidamount;

    @Basic(optional = false)
    @Column(name = "balanceamount")
    private BigDecimal balanceamount;

    @Basic(optional = true)
    @Column(name = "checkno")
    private String checkno;

    @Basic(optional = true)
    @Column(name = "checkdate")
    private LocalDate checkdate;

    @Basic(optional = true)
    @Column(name = "bankname")
    private String bankname;

    @Basic(optional = true)
    @Column(name = "accountno")
    private String accountno;

    @Basic(optional = true)
    @Column(name = "holdername")
    private String holdername;

    @Basic(optional = true)
    @Column(name = "depositdatetime")
    private LocalDate depositdatetime;

    @Basic(optional = true)
    @Column(name = "transferid")
    private String transferid;

    @JoinColumn(name = "supplier_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "grn_id" , referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private GRN grn_id;

    @JoinColumn(name = "supplierpaymentstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private SupplierpaymentStatus supplierpaymentstatus_id;


    @JoinColumn(name = "paymentmethod_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private PaymentMethod paymentmethod_id;

    public SupplierPayment(String billno) {
        this.billno = billno;
    }


}
