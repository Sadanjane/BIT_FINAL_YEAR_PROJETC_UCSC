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
@Table(name = "grn")

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GRN {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic (optional = false)
    @Column(name = "grncode")
    private String grncode;

    @Basic(optional = true)
    @Column(name = "supplierbill")
    private String supplierbill ;

    @Basic(optional = false)
    @Column(name = "receiveddate")
    private LocalDate receiveddate;

    @Basic(optional = false)
    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @Basic(optional = false)
    @Column(name = "discountedratio")
    private Integer discountedratio;

    @Basic(optional = false)
    @Column(name = "netamount")
    private BigDecimal netamount;

    @Basic(optional = false)
    @Column(name = "returnamount")
    private BigDecimal returnamount;

    @Basic(optional = false)
    @Column(name = "grossamount")
    private BigDecimal grossamount;

    @Basic(optional = false)
    @Column(name = "addeddate")
    private LocalDate addeddate ;

    @Basic(optional = true)
    @Column(name = "description")
    private String description ;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "supplier_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "porder_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private PurchaseOrder porder_id;

    @JoinColumn(name = "grntype_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private GRNType grntype_id;

    @JoinColumn(name = "grnstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private GRNStatus grnstatus_id;

    @JoinColumn(name = "supplierreturn_id" , referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private SupplierReturn supplierreturn_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "grn_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<GRNHasBatch> grnHasBatchList;

    public GRN(String nextNumber) {
        grncode = nextNumber;
    }

    public GRN(Integer id , String grncode , BigDecimal grossamount){
        this.id = id;
        this.grncode = grncode;
        this.grossamount = grossamount;
    }

    public GRN(Integer id , String grncode ){
        this.id = id;
        this.grncode = grncode;
    }
}
