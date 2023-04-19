package com.OMEL.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "grn_has_batch")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GRNHasBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "qty")
    private BigDecimal qty;

    @Basic(optional = false)
    @Column(name = "freeqty")
    private BigDecimal freeqty;

    @Basic(optional = false)
    @Column(name = "totalqty")
    private BigDecimal totalqty;

    @Basic(optional = false)
    @Column(name = "linetotal")
    private BigDecimal linetotal;

    @JoinColumn(name = "grn_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private GRN grn_id;

    @JoinColumn(name = "batch_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Batch batch_id;

}
