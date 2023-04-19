package com.OMEL.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "supplierreturn")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierReturn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "supreturncode")
    private String supreturncode;

    @Basic(optional = false)
    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @Basic(optional = false)
    @Column(name = "addeddate")
    private LocalDate addeddate;

    @Basic(optional = true)
    @Column(name = "description")
    private String description;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "returnstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private ReturnStatus returnstatus_id;

    @JoinColumn(name = "supplier_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "supplierreturn_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<SupplierReturnHasItem> supplierReturnHasItemList;

    public SupplierReturn(String nextNumber) {
        supreturncode = nextNumber;
    }

}
