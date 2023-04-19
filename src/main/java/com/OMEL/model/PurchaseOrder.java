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
@Table(name = "porder")

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "pordercode")
    private String pordercode;

    @Basic(optional = false)
    @Column(name = "requireddate")
    private LocalDate requireddate;

    @Basic(optional = false)
    @Column(name = "addeddate")
    private LocalDate addeddate;

    @Basic(optional = false)
    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @Basic(optional = true)
    @Column(name = "description")
    private String description;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "porderstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private PurchaseOrderStatus porderstatus_id;

    @JoinColumn(name = "quatation_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Quatation quatation_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "porder_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<POrderHasItem> porderHasItemList;

    public PurchaseOrder(String pordercode) {
        this.pordercode = pordercode;
    }



    //public PurchaseOrder(String regno) {
     //   this.regno = regno;
    //}
}
