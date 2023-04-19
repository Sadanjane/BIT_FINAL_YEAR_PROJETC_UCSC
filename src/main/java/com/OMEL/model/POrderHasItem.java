package com.OMEL.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "porder_has_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class POrderHasItem {

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
    private Integer qty;

    @Basic(optional = false)
    @Column(name = "linetotal")
    private BigDecimal linetotal;

    @JoinColumn(name = "porder_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private PurchaseOrder porder_id;

    @JoinColumn(name = "item_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Item item_id;

}
