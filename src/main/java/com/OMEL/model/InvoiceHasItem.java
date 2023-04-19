package com.OMEL.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "invoice_has_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceHasItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "qty")
    private BigDecimal qty;

    @Basic(optional = false)
    @Column(name = "saleprice")
    private BigDecimal saleprice;

    @Basic(optional = false)
    @Column(name = "lastsaleprice")
    private BigDecimal lastsaleprice;

    @Basic(optional = false)
    @Column(name = "linetotal")
    private BigDecimal linetotal;

    @JoinColumn(name = "invoice_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private Invoice invoice_id;

    @JoinColumn(name = "item_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Item item_id;

    @JoinColumn(name = "batch_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Batch batch_id;



}
