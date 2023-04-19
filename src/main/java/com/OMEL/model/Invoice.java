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
@Table(name = "invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic (optional = false)
    @Column(name = "invoiceno")
    private String invoiceno;

    @Basic(optional = true)
    @Column(name = "cname")
    private String cname ;

    @Basic(optional = true)
    @Column(name = "cmobile")
    private String cmobile;

    @Basic(optional = false)
    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @Basic(optional = false)
    @Column(name = "discountratio")
    private BigDecimal discountratio;

    @Basic(optional = false)
    @Column(name = "netamount")
    private BigDecimal netamount;

    @Basic(optional = false)
    @Column(name = "paidamount")
    private BigDecimal paidamount;

    @Basic(optional = false)
    @Column(name = "balanceamount")
    private BigDecimal balanceamount;

    @Basic(optional = false)
    @Column(name = "invoicedatetime")
    private LocalDate invoicedatetime ;

    @Basic(optional = true)
    @Column(name = "description")
    private String description ;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "customer_id" , referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Customer customer_id;

    @JoinColumn(name = "customerorder_id" , referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Customer customerorder_id;

    @JoinColumn(name = "invoicepaymentmethod_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private InvoicePaymentMethod invoicepaymentmethod_id;

    @JoinColumn(name = "invoicestatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private InvoiceStatus invoicestatus_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "invoice_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<InvoiceHasItem> invoiceHasItemList;

    public Invoice(String invoiceno) {
        this.invoiceno = invoiceno;
    }

    public Invoice(Integer id , String invoiceno , Customer customer_id , BigDecimal netamount){
        this.id = id;
        this.invoiceno = invoiceno;
        this.customer_id = customer_id;
        this.netamount = netamount;
    }

    public Invoice(Integer id , BigDecimal netamount , LocalDate invoicedatetime){
        this.id = id;
        this.netamount = netamount;
        this.invoicedatetime = invoicedatetime;
    }
}
