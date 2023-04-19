package com.OMEL.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "supplierreturn_has_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierReturnHasItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "purchaseprice")
    private BigDecimal purchaseprice;

    @Basic(optional = false)
    @Column(name = "qty")
    private BigDecimal qty;

    @Basic(optional = false)
    @Column(name = "linetotal")
    private BigDecimal linetotal;


    @JoinColumn(name = "supplierreturn_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private SupplierReturn supplierreturn_id;

    @JoinColumn(name = "batch_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Batch batch_id;

    @JoinColumn(name = "item_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Item item_id;

    @JoinColumn(name = "returnreason_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private ReturnReason returnreason_id;
}
