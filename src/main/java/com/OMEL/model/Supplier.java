package com.OMEL.model;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "supplier")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "regno")
    private String regno;

    @Basic(optional = false)
    @Column(name = "companyfullname")
    private String companyfullname;

    @Basic(optional = false)
    @Column(name = "landno")
    private Integer landno;

    @Basic(optional = false)
    @Column(name = "email")
    private String email;

    @Basic(optional = false)
    @Column(name = "address")
    private String address ;

    @Basic(optional = true)
    @Column(name = "companyregno")
    private String companyregno;

    @Basic(optional = false)
    @Column(name = "cpname")
    private String cpname;

    @Basic(optional = false)
    @Column(name = "cpmobile")
    private Integer cpmobile;

    @Basic(optional = true)
    @Column(name = "bankaccno")
    private String bankaccno;

    @Basic(optional = true)
    @Column(name = "bankaccname")
    private String bankaccname;

    @Basic(optional = true)
    @Column(name = "bankname")
    private String bankname ;

    @Basic(optional = true)
    @Column(name = "bankbranchname")
    private String bankbranchname;

    @Basic(optional = false)
    @Column(name = "creditlimit")
    private BigDecimal creditlimit;

    @Basic(optional = false)
    @Column(name = "addeddate")
    private String addeddate;

    @Basic(optional = true)
    @Column(name = "description")
    private String description;

    @Basic(optional = true)
    @Column(name = "areasamount")
    private BigDecimal areasamount;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "supplierstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private SupplierStatus supplierstatus_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "supplier_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<SupplierHasItem> supplierHasItemList;

    public Supplier(String regno) {
        this.regno = regno;
    }

    public Supplier(Integer id , String regno , String companyfullname , BigDecimal areasamount , BigDecimal creditlimit){
        this.id = id;
        this.regno = regno;
        this.companyfullname = companyfullname;
        this.areasamount = areasamount;
        this.creditlimit = creditlimit;
    }

    public Supplier(String companyfullname , BigDecimal areasamount){
        this.companyfullname = companyfullname;
        this.areasamount = areasamount;
    }
}
